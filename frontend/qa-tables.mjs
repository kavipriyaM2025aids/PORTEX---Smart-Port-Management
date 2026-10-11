export default async function run(page, ui) {
  const snap = await ui.snapshot();
  const invoicesRef = snap.match(/@(e\d+) button "Customer Invoices"/)?.[1];
  if (!invoicesRef) return { error: 'no invoices nav button', snap };
  await ui.click(invoicesRef);
  await page.waitForTimeout(800);
  const after = await ui.snapshot();
  return {
    hasTable: after.includes('table') || after.includes('Invoice'),
    headers: await page.evaluate(() =>
      Array.from(document.querySelectorAll('thead th')).map((th) => th.innerText)
    ),
    rowCount: await page.evaluate(() => document.querySelectorAll('tbody tr').length),
    bodyBg: await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  };
}