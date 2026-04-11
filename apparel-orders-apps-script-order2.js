// ============================================================
//  Shark City Hoops - Apparel Order Form Backend  (Order 2)
//  Google Apps Script  |  Season 30
//
//  SETUP STEPS:
//  1. Go to script.google.com logged in as coachron@sharkcityhoops.com
//  2. Click "New project" -> paste this entire file
//  3. Click the floppy disk icon to save (name it "SCH Apparel Orders - Order 2")
//  4. Click Deploy -> New deployment
//       Type: Web app
//       Execute as: Me (coachron@sharkcityhoops.com)
//       Who has access: Anyone
//  5. Click Deploy -> copy the Web App URL
//  6. Paste that URL into shark-city-order-form-order2.html where it says:
//       const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
//  7. Redeploy whenever you edit this script (Deploy -> Manage deployments -> Edit)
//
//  NOTE: On first run, this script will automatically create a new
//  Google Sheet named "SCH Season 30 - Apparel Orders (Order 2)"
//  in the coachron@sharkcityhoops.com Drive with the same structure
//  as the original Order 1 sheet.
// ============================================================

const HEADERS = [
    'Timestamp', 'Parent Name', 'Player Name', 'Email', 'Phone', 'Team', 'Payment Method',
    'Tee YS', 'Tee YM', 'Tee YL', 'Tee S', 'Tee M', 'Tee L', 'Tee XL', 'Tee 2XL', 'Tee 3XL',
    'LS YS', 'LS YM', 'LS YL', 'LS S', 'LS M', 'LS L', 'LS XL', 'LS 2XL', 'LS 3XL',
    'Order Total', 'Notes',
  ];

const SPREADSHEET_ID = '';
const SHEET_NAME = 'Orders';
const SPREADSHEET_TITLE = 'SCH Season 30 - Apparel Orders (Order 2)';

function doPost(e) {
    try {
          const data = JSON.parse(e.postData.contents);
          const sheet = getOrCreateSheet();
          appendOrder(sheet, data);
          return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
          return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message })).setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet(e) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
    let ss;
    const props = PropertiesService.getScriptProperties();
    const savedId = props.getProperty('SPREADSHEET_ID') || SPREADSHEET_ID;
    if (savedId) {
          ss = SpreadsheetApp.openById(savedId);
    } else {
          ss = SpreadsheetApp.create(SPREADSHEET_TITLE);
          const newId = ss.getId();
          props.setProperty('SPREADSHEET_ID', newId);
          Logger.log('Created new spreadsheet. ID: ' + newId);
          DriveApp.getFileById(newId).moveTo(DriveApp.getRootFolder());
    }
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
          sheet.appendRow(HEADERS);
          const hr = sheet.getRange(1, 1, 1, HEADERS.length);
          hr.setFontWeight('bold');
          hr.setBackground('#0a3a42');
          hr.setFontColor('#ffffff');
          sheet.setFrozenRows(1);
          sheet.setColumnWidth(4, 220);
          sheet.setColumnWidth(3, 160);
          sheet.getRange(1, 1).setNote('SCH Season 30 - Order 2 | Deadline: May 1, 2026');
    }
    return sheet;
}

function appendOrder(sheet, d) {
    const row = [
          d.timestamp || new Date().toLocaleString(),
          d.parentName || '', d.playerName || '', d.email || '', d.phone || '', d.team || '', d.payment || '',
          d.tee_YS||0, d.tee_YM||0, d.tee_YL||0, d.tee_S||0, d.tee_M||0, d.tee_L||0, d.tee_XL||0, d.tee_2XL||0, d.tee_3XL||0,
          d.ls_YS||0, d.ls_YM||0, d.ls_YL||0, d.ls_S||0, d.ls_M||0, d.ls_L||0, d.ls_XL||0, d.ls_2XL||0, d.ls_3XL||0,
          d.orderTotal || '', d.notes || '',
        ];
    sheet.appendRow(row);
}
