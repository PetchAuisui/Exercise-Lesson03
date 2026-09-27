/**
 * HTML Validator for Worksheet 1: Clickable Images (ใบงานที่ 1 รูปภาพที่คลิกได้)
 * Requirements:
 * 1. โครงสร้างพื้นฐานของเอกสาร HTML ครบถ้วน (<!DOCTYPE html>, <html>, <head>, <title>, <body>)
 * 2. กำหนดชื่อหน้าเว็บว่า "สถานที่ท่องเที่ยว"
 * 3. แสดงรูปภาพจากไฟล์ temple.jpg
 * 4. กำหนดข้อความทดแทนของรูปภาพว่า "วัดไทย"
 * 5. เมื่อคลิกรูปภาพ ให้เปิดหน้า detail.html
 */

export function validateHtmlCode(code) {
  const normalized = code.trim();

  // Test 1: โครงสร้างพื้นฐาน HTML
  const hasDoctype = /<!doctype\s+html>/i.test(normalized);
  const hasHtmlOpen = /<html(\s+[^>]*)?>/i.test(normalized);
  const hasHtmlClose = /<\/html>/i.test(normalized);
  const hasHeadOpen = /<head(\s+[^>]*)?>/i.test(normalized);
  const hasHeadClose = /<\/head>/i.test(normalized);
  const hasTitleTag = /<title(\s+[^>]*)?>.*?<\/title>/is.test(normalized);
  const hasBodyOpen = /<body(\s+[^>]*)?>/i.test(normalized);
  const hasBodyClose = /<\/body>/i.test(normalized);

  const test1Passed = hasDoctype && hasHtmlOpen && hasHtmlClose && 
                      hasHeadOpen && hasHeadClose && hasTitleTag && 
                      hasBodyOpen && hasBodyClose;

  const test1Details = [];
  if (!hasDoctype) test1Details.push('ขาด <!DOCTYPE html>');
  if (!hasHtmlOpen || !hasHtmlClose) test1Details.push('ขาดแท็ก <html> หรือ </html>');
  if (!hasHeadOpen || !hasHeadClose) test1Details.push('ขาดแท็ก <head> หรือ </head>');
  if (!hasTitleTag) test1Details.push('ขาดแท็ก <title>...</title>');
  if (!hasBodyOpen || !hasBodyClose) test1Details.push('ขาดแท็ก <body> หรือ </body>');

  // Test 2: ชื่อหน้าเว็บว่า "สถานที่ท่องเที่ยว"
  const titleMatch = normalized.match(/<title(\s+[^>]*)?>([\s\S]*?)<\/title>/i);
  const titleContent = titleMatch ? titleMatch[2].trim() : '';
  const test2Passed = titleContent.includes('สถานที่ท่องเที่ยว');

  // Test 3: แสดงรูปภาพจากไฟล์ temple.jpg
  // Checks for <img ... src="temple.jpg" ...> or src='temple.jpg'
  const imgRegex = /<img\s+[^>]*src\s*=\s*["'](?:\.\/)?temple\.jpg["'][^>]*>/i;
  const test3Passed = imgRegex.test(normalized);

  // Test 4: กำหนดข้อความทดแทนว่า "วัดไทย" (alt="วัดไทย")
  const altRegex = /<img\s+[^>]*alt\s*=\s*["']วัดไทย["'][^>]*>|<img\s+[^>]*src\s*=\s*["'](?:\.\/)?temple\.jpg["'][^>]*alt\s*=\s*["']วัดไทย["'][^>]*>|<img\s+[^>]*alt\s*=\s*["']วัดไทย["'][^>]*src\s*=\s*["'](?:\.\/)?temple\.jpg["'][^>]*>/i;
  const hasAltWatThai = /alt\s*=\s*["']วัดไทย["']/i.test(normalized);
  const test4Passed = test3Passed && hasAltWatThai;

  // Test 5: เมื่อคลิกรูปภาพ ให้เปิดหน้า detail.html
  // Checks for <a ... href="detail.html" ...> wrapping or containing <img ...>
  // e.g. <a href="detail.html"><img ...></a>
  const linkWithImgRegex = /<a\s+[^>]*href\s*=\s*["'](?:\.\/)?detail\.html["'][^>]*>\s*<img\s+[^>]*>\s*<\/a>/is;
  // Also relaxed check in case of attributes or intermediate spaces
  const hasHrefDetail = /<a\s+[^>]*href\s*=\s*["'](?:\.\/)?detail\.html["'][^>]*>/i.test(normalized);
  const hasClosingA = /<\/a>/i.test(normalized);
  const test5Passed = hasHrefDetail && hasClosingA && linkWithImgRegex.test(normalized);

  const criteria = [
    {
      id: 1,
      title: '1. โครงสร้างพื้นฐานของเอกสาร HTML ครบถ้วน',
      description: 'ประกอบด้วย <!DOCTYPE html>, <html>, <head>, <title>, <body> และแท็กปิดที่ถูกต้อง',
      passed: test1Passed,
      hint: test1Details.length > 0 ? test1Details.join(', ') : 'ถูกต้องสมบูรณ์',
    },
    {
      id: 2,
      title: '2. กำหนดชื่อหน้าเว็บว่า "สถานที่ท่องเที่ยว"',
      description: 'ใส่ข้อความ "สถานที่ท่องเที่ยว" ไว้ในแท็ก <title>...</title> ภายในส่วน <head>',
      passed: test2Passed,
      hint: test2Passed 
        ? 'ถูกต้อง' 
        : (titleContent ? `ชื่อปัจจุบันคือ "${titleContent}" (ต้องการ: "สถานที่ท่องเที่ยว")` : 'ยังไม่ได้ใส่ชื่อหน้าเว็บใน <title>'),
    },
    {
      id: 3,
      title: '3. แสดงรูปภาพจากไฟล์ temple.jpg',
      description: 'ใช้แท็ก <img> พร้อมกำหนด attribute src="temple.jpg"',
      passed: test3Passed,
      hint: test3Passed ? 'ถูกต้อง' : 'ตรวจสอบแท็ก <img> และ src="temple.jpg"',
    },
    {
      id: 4,
      title: '4. กำหนดข้อความทดแทนของรูปภาพว่า "วัดไทย"',
      description: 'ระบุ attribute alt="วัดไทย" ภายในแท็ก <img>',
      passed: test4Passed,
      hint: test4Passed ? 'ถูกต้อง' : 'เพิ่ม alt="วัดไทย" ในแท็ก <img>',
    },
    {
      id: 5,
      title: '5. เมื่อคลิกรูปภาพ ให้เปิดหน้า detail.html',
      description: 'ใช้แท็ก <a href="detail.html">...</a> ครอบแท็ก <img> ไว้',
      passed: test5Passed,
      hint: test5Passed ? 'ถูกต้อง' : 'ใช้ <a href="detail.html"><img ...></a> เพื่อทำรูปภาพเป็นลิงก์',
    }
  ];

  const passedCount = criteria.filter(c => c.passed).length;
  const isAllPassed = passedCount === criteria.length;

  return {
    criteria,
    passedCount,
    totalCount: criteria.length,
    isAllPassed,
    extractedTitle: titleContent || 'ไม่มีชื่อหน้าเว็บ',
  };
}

export const SAMPLE_SOLUTION = `<!DOCTYPE html>
<html>
<head>
    <title>สถานที่ท่องเที่ยว</title>
</head>
<body>
    <a href="detail.html">
        <img src="temple.jpg" alt="วัดไทย">
    </a>
</body>
</html>`;

export const STARTER_TEMPLATE = '';

