import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

export interface ParsedReceipt {
  date: string | null;          // ISO date string
  amount: number | null;        // ILS amount
  vendor: string | null;        // Garage/vendor name
  category: string | null;      // טיפול שמן, צמיגים, בלמים, etc.
  odometerKm: number | null;    // Odometer reading from receipt
  description: string | null;   // Free text description
  confidence: number;           // 0.0 - 1.0
  rawText: string | null;       // OCR text extracted
}

export interface AnalyzedIssue {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suspectedCauses: string[];
  selfChecks: string[];
  confidence: number;
}

const RECEIPT_CATEGORIES = [
  'שמן ומסננים',
  'צמיגים',
  'בלמים',
  'תחזוקה שוטפת',
  'תיקונים',
  'אבחון',
  'מבחן רכב',
  'ביטוח',
  'דלק',
  'חלקים',
  'אחר',
];

@Injectable()
export class ParsingService {
  private readonly logger = new Logger(ParsingService.name);
  private client: Anthropic;
  private useMock: boolean;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    this.useMock = this.configService.get<string>('USE_MOCK_AI') === 'true' || !apiKey || apiKey === 'your_anthropic_api_key_here';

    if (!this.useMock) {
      this.client = new Anthropic({ apiKey });
      this.logger.log('ParsingService initialized with Claude AI');
    } else {
      this.logger.warn('ParsingService running in MOCK mode (no API key configured)');
    }
  }

  async parseReceipt(filename: string, mimeType: string): Promise<ParsedReceipt> {
    if (this.useMock) {
      return this.mockParseReceipt(filename);
    }

    try {
      const filePath = path.join(process.cwd(), 'data', 'uploads', filename);

      // For images: use vision API
      if (mimeType.startsWith('image/')) {
        return await this.parseReceiptImage(filePath, mimeType);
      }

      // For PDFs: extract text and parse
      return await this.parseReceiptText(filename);
    } catch (error) {
      this.logger.error(`Receipt parsing failed: ${error.message}`);
      throw error;
    }
  }

  private async parseReceiptImage(filePath: string, mimeType: string): Promise<ParsedReceipt> {
    const imageData = fs.readFileSync(filePath);
    const base64 = imageData.toString('base64');
    const mediaType = mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

    const response = await this.client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: `אתה מומחה בניתוח קבלות מוסך ישראליות. נתח את הקבלה הזו והחזר JSON בלבד (ללא טקסט נוסף).

החזר את המבנה הבא:
{
  "date": "YYYY-MM-DD or null",
  "amount": number or null,
  "vendor": "שם המוסך or null",
  "category": "אחת מהקטגוריות: ${RECEIPT_CATEGORIES.join(', ')}",
  "odometerKm": number or null,
  "description": "תיאור קצר של העבודה שנעשתה",
  "confidence": 0.0-1.0,
  "rawText": "הטקסט שחילצת מהקבלה"
}`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.safeJsonParse(text);
  }

  private async parseReceiptText(filename: string): Promise<ParsedReceipt> {
    // For PDFs without vision, use text extraction placeholder
    const response = await this.client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `קובץ PDF בשם "${filename}" הועלה. זוהי קבלה ממוסך.
בהיעדר יכולת OCR, החזר JSON עם ערכי ברירת מחדל סבירים:
{
  "date": null,
  "amount": null,
  "vendor": null,
  "category": "תחזוקה שוטפת",
  "odometerKm": null,
  "description": "PDF uploaded - manual review required",
  "confidence": 0.1,
  "rawText": null
}`,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.safeJsonParse(text);
  }

  async analyzeIssue(filename: string, mimeType: string): Promise<AnalyzedIssue> {
    if (this.useMock) {
      return this.mockAnalyzeIssue(filename);
    }

    try {
      const filePath = path.join(process.cwd(), 'data', 'uploads', filename);

      if (!mimeType.startsWith('image/')) {
        throw new Error('Issue analysis requires an image file');
      }

      const imageData = fs.readFileSync(filePath);
      const base64 = imageData.toString('base64');
      const mediaType = mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

      const response = await this.client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: base64 },
              },
              {
                type: 'text',
                text: `אתה מומחה לאבחון תקלות רכב. נתח את התמונה והחזר JSON בלבד.

החזר:
{
  "title": "כותרת קצרה של התקלה בעברית",
  "description": "תיאור מפורט של מה שנראה בתמונה",
  "severity": "low/medium/high/critical",
  "suspectedCauses": ["סיבה אפשרית 1", "סיבה אפשרית 2"],
  "selfChecks": ["בדיקה עצמית 1", "בדיקה עצמית 2"],
  "confidence": 0.0-1.0
}

הנחיות:
- critical: עצור מיד, אל תנסוע
- high: פנה למוסך היום
- medium: פנה למוסך השבוע
- low: בדוק בטיפול הבא`,
              },
            ],
          },
        ],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      return this.safeJsonParse(text) as AnalyzedIssue;
    } catch (error) {
      this.logger.error(`Issue analysis failed: ${error.message}`);
      throw error;
    }
  }

  private safeJsonParse(text: string): any {
    try {
      // Extract JSON from response (Claude sometimes adds explanation text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch {
      this.logger.warn('Failed to parse JSON from Claude response, using fallback');
      return {
        date: null, amount: null, vendor: null,
        category: 'אחר', odometerKm: null,
        description: null, confidence: 0.1, rawText: text,
      };
    }
  }

  // Mock responses for development without API key
  private mockParseReceipt(filename: string): ParsedReceipt {
    this.logger.log(`[MOCK] Parsing receipt: ${filename}`);
    const today = new Date().toISOString().split('T')[0];
    return {
      date: today,
      amount: 450,
      vendor: 'מוסך כהן ובניו',
      category: 'שמן ומסננים',
      odometerKm: 85000,
      description: 'החלפת שמן מנוע + מסנן שמן',
      confidence: 0.95,
      rawText: '[MOCK DATA - set ANTHROPIC_API_KEY for real parsing]',
    };
  }

  private mockAnalyzeIssue(filename: string): AnalyzedIssue {
    this.logger.log(`[MOCK] Analyzing issue: ${filename}`);
    return {
      title: 'נורת בדוק מנוע דלוקה',
      description: 'נורת Check Engine דולקת בלוח המחוונים. ייתכן שיש תקלה בחיישן החמצן או בשסתום EGR.',
      severity: 'medium',
      suspectedCauses: [
        'חיישן חמצן (O2 Sensor) פגום',
        'קפסולת הצתה בעייתית',
        'שסתום EGR תקוע',
      ],
      selfChecks: [
        'בדוק שפקק מיכל הדלק סגור היטב',
        'בדוק שאין ריח חריג מהמנוע',
        'שים לב אם יש שינוי בצריכת הדלק',
      ],
      confidence: 0.75,
    };
  }
}