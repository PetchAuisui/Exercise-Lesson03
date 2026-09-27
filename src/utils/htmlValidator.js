/**
 * HTML Validator for Worksheet 1: Clickable Images (ใบงานที่ 1 รูปภาพที่คลิกได้)
 * Requirements from Worksheet:
 * 1. เขียนหน้าเว็บโดยใช้ โครงสร้างพื้นฐานของเอกสาร HTML ให้ครบถ้วน
 * 2. กำหนดชื่อหน้าเว็บว่า "สถานที่ท่องเที่ยว"
 * 3. แสดงรูปภาพจากไฟล์ temple.jpg ในโฟลเดอร์ image
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

  // Test 2: ชื่อหน้าเว็บว่า "สถานที่ท่องเที่ยว"
  const titleMatch = normalized.match(/<title(\s+[^>]*)?>([\s\S]*?)<\/title>/i);
  const titleContent = titleMatch ? titleMatch[2].trim() : '';
  const test2Passed = titleContent.includes('สถานที่ท่องเที่ยว');

  // Test 3: แสดงรูปภาพจากไฟล์ temple.jpg ในโฟลเดอร์ image (รองรับทั้ง image/temple.jpg และ temple.jpg)
  const imgRegex = /<img\s+[^>]*src\s*=\s*["'](?:\.\/)?(?:image\/)?temple\.jpg["'][^>]*>/i;
  const test3Passed = imgRegex.test(normalized);

  // Test 4: กำหนดข้อความทดแทนว่า "วัดไทย" (alt="วัดไทย")
  const hasAltWatThai = /alt\s*=\s*["']วัดไทย["']/i.test(normalized);
  const test4Passed = test3Passed && hasAltWatThai;

  // Test 5: เมื่อคลิกรูปภาพ ให้เปิดหน้า detail.html
  const linkWithImgRegex = /<a\s+[^>]*href\s*=\s*["'](?:\.\/)?detail\.html["'][^>]*>\s*<img\s+[^>]*>\s*<\/a>/is;
  const hasHrefDetail = /<a\s+[^>]*href\s*=\s*["'](?:\.\/)?detail\.html["'][^>]*>/i.test(normalized);
  const hasClosingA = /<\/a>/i.test(normalized);
  const test5Passed = hasHrefDetail && hasClosingA && linkWithImgRegex.test(normalized);

  // Criteria without tag hints/spoilers
  const criteria = [
    {
      id: 1,
      title: '1. เขียนหน้าเว็บโดยใช้โครงสร้างพื้นฐานของเอกสาร HTML ให้ครบถ้วน',
      passed: test1Passed,
    },
    {
      id: 2,
      title: '2. กำหนดชื่อหน้าเว็บว่า "สถานที่ท่องเที่ยว"',
      passed: test2Passed,
    },
    {
      id: 3,
      title: '3. แสดงรูปภาพจากไฟล์ temple.jpg ในโฟลเดอร์ image',
      passed: test3Passed,
    },
    {
      id: 4,
      title: '4. กำหนดข้อความทดแทนของรูปภาพว่า "วัดไทย"',
      passed: test4Passed,
    },
    {
      id: 5,
      title: '5. เมื่อคลิกรูปภาพ ให้เปิดหน้า detail.html',
      passed: test5Passed,
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
        <img src="image/temple.jpg" alt="วัดไทย">
    </a>
</body>
</html>`;

export const STARTER_TEMPLATE = '';
