// const emojiMap: Record<string, string> = {
//   smile: "😄",
//   grin: "😁",
//   joy: "😂",
//   wink: "😉",
//   heart: "❤️",
//   thumbs_up: "👍",
//   cry: "😢",
//   fire: "🔥",
//   star: "⭐",
//   check: "✅",
// };

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
  // html = html.replace(/(?<!\\)==([\s\S]+?)==/g, "<mark>$1</mark>");

  // Escape markdown special characters
  // html = html.replace(/\\([*~_=`#])/g, "$1");

  // Handle 2+ newlines with <br> equivalents
  // html = html.replace(/\n{2,}/g, (match) => "<br>".repeat(match.length));

  // Superscript (^text^)
  // html = html.replace(/\^\((.+?)\)\^/g, "<sup>$1</sup>");

  // Subscript (~text~)
  // html = html.replace(/~\((.+?)\)~/g, "<sub>$1</sub>");

  // Warning (!text!)
  // html = html.replace(/!\((.+?)\)!/g, "<span class='warning'>$1</span>");

  //  Handle  newlines and hrozontal lines
  html = convertor.emptyTagCreater(html);

  // html = html.replace(/:([a-zA-Z0-9_+-]+):/g, (match, p1) => {
  //   return emojiMap[p1] || match;
  // });

  console.log(html);

  return html;
}
