/**
 * Playwright Debugging Script for Login Flow
 *
 * This script performs deep debugging of the login flow:
 * - Visual evidence via screenshots
 * - DOM state snapshots
 * - Network request logging
 * - Console error capture
 * - UI interaction validation
 */

import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for debug artifacts
const DEBUG_DIR = path.join(__dirname, 'debug-output');

// Ensure debug directory exists
if (!fs.existsSync(DEBUG_DIR)) {
  fs.mkdirSync(DEBUG_DIR, { recursive: true });
}

// Log file for network and console errors
const LOG_FILE = path.join(DEBUG_DIR, 'login-debug.log');
let logStream: fs.WriteStream;

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  logStream.write(logMessage);
}

test.describe('Login Flow Deep Debugging', () => {
  test.beforeEach(async ({ page }) => {
    // Initialize log file
    logStream = fs.createWriteStream(LOG_FILE, { flags: 'w' });
    log('=== Login Flow Debugging Started ===');

    // Capture all console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error' || type === 'warning') {
        log(`[BROWSER ${type.toUpperCase()}] ${text}`);
      } else {
        log(`[BROWSER console] ${text}`);
      }
    });

    // Capture all network requests
    page.on('request', (request) => {
      const url = request.url();
      const method = request.method();
      log(`[NETWORK REQUEST] ${method} ${url}`);

      // Log request headers for API calls
      if (url.includes('/api/')) {
        const headers = request.headers();
        log(`  Headers: ${JSON.stringify(headers, null, 2)}`);

        // Log POST body
        if (method === 'POST') {
          const postData = request.postData();
          if (postData) {
            log(`  Body: ${postData}`);
          }
        }
      }
    });

    // Capture all network responses
    page.on('response', async (response) => {
      const url = response.url();
      const status = response.status();
      const statusText = response.statusText();

      log(`[NETWORK RESPONSE] ${status} ${statusText} - ${url}`);

      // Log failed requests
      if (status >= 400) {
        log(`  ❌ FAILED REQUEST`);
        try {
          const body = await response.text();
          log(`  Response Body: ${body}`);
        } catch (err) {
          log(`  Could not read response body: ${err}`);
        }
      }

      // Log API responses
      if (url.includes('/api/')) {
        try {
          const contentType = response.headers()['content-type'];
          if (contentType && contentType.includes('application/json')) {
            const body = await response.text();
            log(`  Response Body: ${body}`);
          }
        } catch (err) {
          log(`  Could not read response body: ${err}`);
        }
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      log(`[PAGE ERROR] ${error.message}`);
      log(`  Stack: ${error.stack}`);
    });

    // Capture request failures
    page.on('requestfailed', (request) => {
      const failure = request.failure();
      log(`[REQUEST FAILED] ${request.url()}`);
      log(`  Failure: ${failure?.errorText || 'Unknown error'}`);
    });
  });

  test('Debug Login Flow - Full Analysis', async ({ page }) => {
    log('\n=== STEP 1: Navigate to Login Page ===');
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');

    // Screenshot: Initial load
    await page.screenshot({
      path: path.join(DEBUG_DIR, '1-initial-load.png'),
      fullPage: true
    });
    log('✅ Screenshot saved: 1-initial-load.png');

    // DOM Snapshot: Initial state
    const initialHTML = await page.content();
    fs.writeFileSync(
      path.join(DEBUG_DIR, '1-initial-dom.html'),
      initialHTML
    );
    log('✅ DOM snapshot saved: 1-initial-dom.html');

    log('\n=== STEP 2: Check Form Elements ===');

    // Check if login form exists
    const formExists = await page.locator('form').count();
    log(`Form elements found: ${formExists}`);

    // Check email input
    const emailInput = page.locator('input[type="email"]');
    const emailCount = await emailInput.count();
    log(`Email input count: ${emailCount}`);

    if (emailCount > 0) {
      const emailVisible = await emailInput.isVisible();
      const emailEnabled = await emailInput.isEnabled();
      log(`Email input visible: ${emailVisible}, enabled: ${emailEnabled}`);
    }

    // Check submit button
    const submitButton = page.locator('button[type="submit"]');
    const buttonCount = await submitButton.count();
    log(`Submit button count: ${buttonCount}`);

    if (buttonCount > 0) {
      const buttonVisible = await submitButton.isVisible();
      const buttonEnabled = await submitButton.isEnabled();
      const buttonText = await submitButton.textContent();
      log(`Submit button visible: ${buttonVisible}, enabled: ${buttonEnabled}`);
      log(`Submit button text: "${buttonText}"`);

      // Check if button is obscured
      const boundingBox = await submitButton.boundingBox();
      if (boundingBox) {
        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;
        const elementAtPoint = await page.evaluateHandle(
          ({ x, y }) => document.elementFromPoint(x, y),
          { x: centerX, y: centerY }
        );
        const isObscured = !(await elementAtPoint.evaluate(
          (el, btn) => el === btn || btn?.contains(el),
          await submitButton.elementHandle()
        ));
        log(`Submit button obscured by another element: ${isObscured}`);
      }
    }

    log('\n=== STEP 3: Fill Login Form ===');

    // Fill email
    await emailInput.fill('etamar234@gmail.com');
    log('✅ Email filled: etamar234@gmail.com');

    // Fill name (optional field)
    const nameInput = page.locator('input[id="name"]');
    const nameCount = await nameInput.count();
    if (nameCount > 0) {
      await nameInput.fill('איתמר בן ארי');
      log('✅ Name filled: איתמר בן ארי');
    }

    // Screenshot: After input
    await page.screenshot({
      path: path.join(DEBUG_DIR, '2-after-input.png'),
      fullPage: true
    });
    log('✅ Screenshot saved: 2-after-input.png');

    // DOM Snapshot: After input
    const afterInputHTML = await page.content();
    fs.writeFileSync(
      path.join(DEBUG_DIR, '2-after-input-dom.html'),
      afterInputHTML
    );
    log('✅ DOM snapshot saved: 2-after-input-dom.html');

    log('\n=== STEP 4: Submit Form ===');

    // Wait for any pending operations
    await page.waitForTimeout(500);

    // Click submit button and wait for response
    await submitButton.click();
    log('✅ Submit button clicked');

    // Wait for either navigation or error toast
    await Promise.race([
      page.waitForURL('**/garage', { timeout: 5000 }).catch(() => null),
      page.waitForSelector('[data-sonner-toast]', { timeout: 5000 }).catch(() => null),
      page.waitForTimeout(5000)
    ]);

    // Screenshot: After submit
    await page.screenshot({
      path: path.join(DEBUG_DIR, '3-after-submit.png'),
      fullPage: true
    });
    log('✅ Screenshot saved: 3-after-submit.png');

    // DOM Snapshot: After submit
    const afterSubmitHTML = await page.content();
    fs.writeFileSync(
      path.join(DEBUG_DIR, '3-after-submit-dom.html'),
      afterSubmitHTML
    );
    log('✅ DOM snapshot saved: 3-after-submit-dom.html');

    log('\n=== STEP 5: Check Results ===');

    // Check current URL
    const currentURL = page.url();
    log(`Current URL: ${currentURL}`);

    // Check for error toasts
    const toasts = await page.locator('[data-sonner-toast]').all();
    log(`Toast notifications count: ${toasts.length}`);

    for (let i = 0; i < toasts.length; i++) {
      const toastText = await toasts[i].textContent();
      const toastType = await toasts[i].getAttribute('data-type');
      log(`Toast ${i + 1}: [${toastType}] ${toastText}`);
    }

    // Check localStorage
    const localStorage = await page.evaluate(() => {
      return {
        userId: window.localStorage.getItem('userId'),
        authToken: window.localStorage.getItem('authToken')
      };
    });
    log(`LocalStorage - userId: ${localStorage.userId || 'NOT SET'}`);
    log(`LocalStorage - authToken: ${localStorage.authToken ? 'SET (length: ' + localStorage.authToken.length + ')' : 'NOT SET'}`);

    log('\n=== STEP 6: Environment Check ===');

    // Check if API URL is configured correctly
    const apiUrl = await page.evaluate(() => {
      return (import.meta as any).env?.VITE_API_URL || 'NOT SET';
    });
    log(`VITE_API_URL from browser: ${apiUrl}`);

    // Test direct API connection from browser
    log('\n=== STEP 7: Direct API Test from Browser ===');
    const apiTestResult = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test-playwright@example.com',
            name: 'Playwright Test'
          })
        });

        return {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: await response.text()
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
          errorType: error.constructor.name
        };
      }
    });

    log(`API Test Result: ${JSON.stringify(apiTestResult, null, 2)}`);

    log('\n=== Debugging Complete ===');
    log(`\nAll artifacts saved to: ${DEBUG_DIR}`);
    log('Review the following files:');
    log('  - login-debug.log (this file)');
    log('  - 1-initial-load.png');
    log('  - 2-after-input.png');
    log('  - 3-after-submit.png');
    log('  - *-dom.html files');
  });

  test.afterEach(async () => {
    if (logStream) {
      logStream.end();
    }
  });
});
