export function combineDocuments(docs: any) {
  const output = [];
  docs.forEach((doc: any) => {
    output.push(JSON.parse(doc.pageContent));
  });
  return JSON.stringify(output);
}
