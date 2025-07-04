import convertor from "@/convertor/h3-convertor";

export function textToHtml(markdown: string): string {
  let html = markdown;
  // TODO: make the filter for the \n already there in the string
  // Headings
  html = convertor.h3Convertor(JSON.stringify(html));

  // checkboxes
  html = convertor.checkBoxConvertor(html);

  // Bulleted lists
  html = convertor.bulletedListConvertor(html);

  // numbered lists
  html = convertor.numberedListConvertor(html);

  // Bold + Italic
  html = convertor.boldItalicConvertor(html);

  // Bold
  html = convertor.boldConvertor(html);

  // Italic
  html = convertor.italicConvertor(html);

  // Strikethrough
  html = convertor.strikethroughConvertor(html);

  // Inline code
  html = convertor.inlineCodeConvertor(html);

  // Highlight
  html = convertor.highlightConvertor(html);

  // Escape markdown special characters
  html = convertor.removeEscapeCharacters(html);

  // Superscript (^text^)
  html = convertor.superscriptConvertor(html);

  // Subscript (~text~)
  html = convertor.subscriptConvertor(html);

  // Warning (!text!)
  html = convertor.warningConvertor(html);

  //  Handle  newlines and hrozontal lines
  html = convertor.emptyTagCreater(html);

  // Emojis
  html = convertor.textEmojiConvertor(html);

  console.log(html);

  return html;
}
