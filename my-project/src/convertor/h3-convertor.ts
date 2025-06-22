import { text } from "stream/consumers";

class StringToHtmlConvertor {
  private emojiMap: Record<string, string> = {
    smile: "😄",
    grin: "😁",
    joy: "😂",
    wink: "😉",
    heart: "❤️",
    thumbs_up: "👍",
    cry: "😢",
    fire: "🔥",
    star: "⭐",
    check: "✅",
  };
  /**
   * markdown: string
   * Converts markdown headings to HTML headings.
   * It looks for headings that start with a single hash (#) and converts them to <h3> tags.
   * It also handles multiple hashes (##, ###) and converts them to <h2> and <h1> tags respectively.
   * **/
  h3Convertor(markdown: string): string {
    markdown = markdown.slice(1, -1);
    let foundHash = false;
    let tag: string | undefined = undefined;
    for (let i = 0; i < markdown.length; i++) {
      if (
        markdown[i] === "#" &&
        (i == 0 ||
          (i > 2 && markdown[i - 2] === "\\" && markdown[i - 1] === "n"))
      ) {
        if (markdown[i + 1] === " " && !foundHash) {
          markdown =
            markdown.slice(0, i) +
            "<h1 class='text-5xl'>" +
            markdown.slice(i + 2);
          foundHash = true;
          tag = "h1";
        } else if (
          markdown[i + 1] === "#" &&
          markdown[i + 2] === " " &&
          !foundHash
        ) {
          markdown =
            markdown.slice(0, i) +
            "<h2 class='text-2xl'>" +
            markdown.slice(i + 3);
          foundHash = true;
          tag = "h2";
        } else if (
          markdown[i + 1] === "#" &&
          markdown[i + 2] === "#" &&
          markdown[i + 3] === " " &&
          !foundHash
        ) {
          markdown =
            markdown.slice(0, i) +
            "<h3 class='text-xl'>" +
            markdown.slice(i + 4);
          foundHash = true;
          tag = "h3";
        }
      }
      if (foundHash && markdown[i] === "\\" && markdown[i + 1] === "n") {
        markdown = markdown.slice(0, i) + `</${tag}>` + markdown.slice(i);
        foundHash = false;
      }
      if (markdown[i] === "\\" && markdown[i + 1] !== "n") {
        markdown = markdown.slice(0, i) + markdown.slice(i + 1);
      }
    }
    if (foundHash) {
      return markdown + `</${tag}>`;
    }
    return markdown;
  }

  /**
   * converts new lines in markdown to HTML line breaks.
   * It replaces every occurrence of a backslash followed by 'n' with a <br/> tag.
   * It also replaces every occurrence of three consecutive dashes with an <hr/> tag.
   * * @function emptyTagCreater
   * @param markdown string
   */

  emptyTagCreater(markdown: string): string {
    for (let i = 0; i < markdown.length; i++) {
      if (markdown[i] === "\\" && markdown[i + 1] === "n") {
        markdown = markdown.slice(0, i) + "<br/>" + markdown.slice(i + 2);
      }
      if (
        markdown[i] === "-" &&
        markdown[i + 1] === "-" &&
        markdown[i + 2] === "-"
      ) {
        markdown = markdown.slice(0, i) + "<hr/>" + markdown.slice(i + 3);
      }
    }
    return markdown;
  }

  /**
   *
   * @param markdown string
   * Converts markdown checkboxes to HTML checkboxes both checked and unchecked.
   * @returns
   */
  checkBoxConvertor(markdown: string): string {
    let found = false;
    for (let i = 0; i < markdown.length; i++) {
      if (
        markdown[i] === "-" &&
        markdown[i + 1] === "[" &&
        (markdown[i + 2] === "x" || markdown[i + 2] === " ") &&
        markdown[i + 3] === "]" &&
        markdown[i + 4] === " " &&
        !found
      ) {
        found = true;
        markdown =
          markdown.slice(0, i) +
          `<input type='checkbox' class='checkbox checkbox-primary' ${
            markdown[i + 2] === "x" && "checked"
          } id=${i} /> <label for=${i} class="ml-1 text-2xl">` +
          markdown.slice(i + 4);
      }
      if (markdown[i] === "\\" && markdown[i + 1] === "n" && found) {
        markdown = markdown.slice(0, i) + "</label>" + markdown.slice(i);
        found = false;
      }
    }
    return markdown;
  }

  /**
   *
   * @param markdown string
   * Converts markdown bulleted lists to HTML unordered lists.
   * @returns
   */

  bulletedListConvertor(markdown: string): string {
    let addListTag = false;
    let addUnorderdListTag = false;
    for (let i = 0; i < markdown.length; i++) {
      if (markdown[i] === "-" && markdown[i + 1] === " ") {
        addListTag = true;
        if (!addUnorderdListTag) {
          addUnorderdListTag = true;
          markdown =
            markdown.slice(0, i) +
            "<ul class='list-disc list-inside space-y-2 text-gray-700 text-2xl' ><li>" +
            markdown.slice(i + 2);
        } else {
          markdown = markdown.slice(0, i) + "<li>" + markdown.slice(i + 2);
        }
      }
      if (markdown[i] === "\\" && markdown[i + 1] === "n" && addListTag) {
        markdown = markdown.slice(0, i) + "</li>" + markdown.slice(i + 2);
        addListTag = false;
      }
      if (
        markdown[i] === "\\" &&
        markdown[i + 1] === "n" &&
        markdown[i + 2] !== "-" &&
        markdown[i + 2] !== " " &&
        addUnorderdListTag
      ) {
        markdown = markdown.slice(0, i + 2) + "</ul>" + markdown.slice(i + 2);
        addUnorderdListTag = false;
      }
    }
    if (addListTag) {
      markdown += "</li>";
    }
    if (addUnorderdListTag) {
      markdown += "</ul>";
    }
    return markdown;
  }

  /**
   *
   * @param markdown string
   * Converts markdown numbered lists to HTML ordered lists.
   * @returns
   */

  numberedListConvertor(markdown: string): string {
    console.log("markdown : ", markdown);
    const numberedList = [];
    let listAdded = false;
    let orderedListTagAdded = false;
    for (let i = 0; i < markdown.length; i++) {
      // if block to check whether the current character is a digit and is it for ordered list with a digit and new line char behind the digit and a dot and space after the digit
      if (
        ((markdown[i - 2] === "\\" && markdown[i - 1] === "n") || i == 0) &&
        !isNaN(Number(markdown[i])) &&
        markdown[i + 1] === "." &&
        markdown[i + 2] === " "
      ) {
        console.log("check of the formate is done");
        //check if the number is following the interval of one
        if (
          (numberedList.length === 0 && Number(markdown[i]) === 1) ||
          numberedList[numberedList.length - 1] + 1 === Number(markdown[i])
        ) {
          console.log("check of the order is done");
          numberedList.push(Number(markdown[i]));
          // condition to add the first ol tag
          if (numberedList.length === 1) {
            const replacement = "<ol class='list-decimal pl-6 text-2xl'><li>";
            markdown =
              markdown.slice(0, i) + replacement + markdown.slice(i + 3);
            i += replacement.length - 3;
            listAdded = true;
            orderedListTagAdded = true;
          } else {
            const replacement = "<li>";
            markdown =
              markdown.slice(0, i) + replacement + markdown.slice(i + 3);
            // Update index to account for inserted content
            i += replacement.length - 3;
            listAdded = true;
          }
        }
      }
      if (listAdded && markdown[i] === "\\" && markdown[i + 1] === "n") {
        markdown = markdown.slice(0, i) + "</li>" + markdown.slice(i + 2);
        listAdded = false;
        if (orderedListTagAdded && isNaN(Number(markdown[i + 2]))) {
          orderedListTagAdded = false;
          markdown = markdown.slice(0, i + 5) + "</ol>" + markdown.slice(i);
        }
        numberedList.length = 0; // reset the numbered list after each item
      }
    }
    if (listAdded) {
      markdown += "</li></ol>";
    }
    return markdown;
  }

  /**
   *
   * @param markdown string
   * @returns
   * Converts markdown bold and italic text to HTML bold and italic text.
   * It looks for text wrapped in three asterisks (***text***) for bold and italic,
   */
  boldItalicConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at a potential *** sequence
      if (
        i <= markdown.length - 3 &&
        markdown[i] === "*" &&
        markdown[i + 1] === "*" &&
        markdown[i + 2] === "*"
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "***";
          i += 3;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 3;
          i += 3;
        } else {
          // Closing tag
          const content = markdown.substring(tagStart, i);
          result += "<strong><em>" + content + "</em></strong>";
          insideTag = false;
          tagStart = -1;
          i += 3;
        }
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "***" + markdown.substring(tagStart);
    }

    return result;
  }
  /**
   *
   * @param markdown
   * @returns
   * Converts markdown bold text to HTML bold text.`
   * It looks for text wrapped in two asterisks (**text**) for bold.
   */
  boldConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at a potential ** sequence
      if (
        i <= markdown.length - 2 &&
        markdown[i] === "*" &&
        markdown[i + 1] === "*"
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "**";
          i += 2;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 2;
          i += 2;
        } else {
          // Closing tag
          const content = markdown.substring(tagStart, i);
          result += "<strong>" + content + "</strong>";
          insideTag = false;
          tagStart = -1;
          i += 2;
        }
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "**" + html.substring(tagStart);
    }

    return result;
  }

  /**
   * Converts markdown italic text to HTML italic text.
   * It looks for text wrapped in underscores (_text_) for italic.
   * @param markdown string
   * @returns string
   */
  italicConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at an underscore
      if (markdown[i] === "_") {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "_";
          i++;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 1;
          i++;
        } else {
          // Closing tag
          const content = markdown.substring(tagStart, i);
          result += "<em>" + content + "</em>";
          insideTag = false;
          tagStart = -1;
          i++;
        }
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "_" + markdown.substring(tagStart);
    }

    return result;
  }

  /**
   *
   * @param markdown
   * @returns
   * Converts markdown strikethrough text to HTML strikethrough text.
   * It looks for text wrapped in double tildes (~~text~~) for str
   */

  strikethroughConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at a potential ~~ sequence
      if (
        i <= markdown.length - 2 &&
        markdown[i] === "~" &&
        markdown[i + 1] === "~"
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "~~";
          i += 2;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 2;
          i += 2;
        } else {
          // Closing tag
          const content = markdown.substring(tagStart, i);
          result += "<del>" + content + "</del>";
          insideTag = false;
          tagStart = -1;
          i += 2;
        }
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "~~" + html.substring(tagStart);
    }

    return result;
  }

  /**
   *
   * @param markdown
   * @returns
   * Converts markdown inline code to HTML code.
   * It looks for text wrapped in backticks (`text`) for inline code.
   */

  inlineCodeConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at a backtick
      if (markdown[i] === "`") {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "`";
          i++;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 1;
          i++;
        } else {
          // Closing tag
          const content = markdown.substring(tagStart, i);
          result += "<code>" + content + "</code>";
          insideTag = false;
          tagStart = -1;
          i++;
        }
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "`" + markdown.substring(tagStart);
    }

    return result;
  }

  /**
   *
   * @param markdown
   * @returns
   * Converts markdown highlight text to HTML highlight text.
   * It looks for text wrapped in double equal signs (==text==) for highlight.
   */
  highlightConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at a potential == sequence
      if (
        i <= markdown.length - 2 &&
        markdown[i] === "=" &&
        markdown[i + 1] === "="
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "==";
          i += 2;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 2;
          i += 2;
        } else {
          // Closing tag
          const content = markdown.substring(tagStart, i);
          result += "<mark>" + content + "</mark>";
          insideTag = false;
          tagStart = -1;
          i += 2;
        }
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "==" + html.substring(tagStart);
    }

    return result;
  }

  /**
   * Removes escape characters from the markdown string.
   * @param markdown The markdown string to process.
   * @returns The processed string with escape characters removed.
   */

  removeEscapeCharacters(markdown: string): string {
    let result = "";
    let i = 0;

    // Use Set for O(1) lookup instead of array includes
    const escapableChars = new Set(["*", "~", "_", "=", "`", "#"]);

    while (i < markdown.length) {
      if (
        markdown[i] === "\\" &&
        i + 1 < markdown.length &&
        escapableChars.has(markdown[i + 1])
      ) {
        // Skip backslash, add escaped character
        result += markdown[i + 1];
        i += 2;
      } else {
        result += markdown[i];
        i++;
      }
    }

    return result;
  }

  /**
   *
   * @param markdown string
   * @returns
   * Converts markdown superscript text to HTML superscript text.
   * It looks for text wrapped in carets (^text^) for superscript.
   */

  superscriptConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at a potential ^( sequence
      if (
        i <= markdown.length - 2 &&
        markdown[i] === "^" &&
        markdown[i + 1] === "("
      ) {
        console.log("SAdada");
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "^(";
          i += 2;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 2; // Start after ^(
          i += 2;
        } else {
          // This shouldn't happen with this syntax, treat as regular text
          result += markdown[i];
          i++;
        }
      }
      // Check if we're at a potential )^ sequence (closing)
      else if (
        i <= markdown.length - 2 &&
        markdown[i] === ")" &&
        markdown[i + 1] === "^" &&
        insideTag
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          // Don't close the tag, continue collecting content
          i += 2;
          continue;
        }

        // Closing tag
        const content = markdown.substring(tagStart, i);
        result += "<sup>" + content + "</sup>";
        insideTag = false;
        tagStart = -1;
        i += 2; // Skip )^
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "^(" + markdown.substring(tagStart);
    }

    return result;
  }

  /**
   *
   * @param markdown
   * @returns
   * Converts markdown subscript text to HTML subscript text.
   * It looks for text wrapped in tildes (~text~) for subscript.
   */

  subscriptConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at a potential ~( sequence
      if (
        i <= markdown.length - 2 &&
        markdown[i] === "~" &&
        markdown[i + 1] === "("
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "~(";
          i += 2;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 2; // Start after ~(
          i += 2;
        } else {
          // This shouldn't happen with this syntax, treat as regular text
          result += markdown[i];
          i++;
        }
      }
      // Check if we're at a potential )~ sequence (closing)
      else if (
        i <= markdown.length - 2 &&
        markdown[i] === ")" &&
        markdown[i + 1] === "~" &&
        insideTag
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          // Don't close the tag, continue collecting content
          i += 2;
          continue;
        }

        // Closing tag
        const content = markdown.substring(tagStart, i);
        result += "<sub>" + content + "</sub>";
        insideTag = false;
        tagStart = -1;
        i += 2; // Skip )~
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "~(" + html.substring(tagStart);
    }

    return result;
  }

  /**
   * Converts markdown warning text to HTML warning text.
   * It looks for text wrapped in !() for warning.
   * @param markdown
   * @returns
   */

  warningConvertor(markdown: string): string {
    let result = "";
    let i = 0;
    let insideTag = false;
    let tagStart = -1;

    while (i < markdown.length) {
      // Check if we're at a potential !( sequence
      if (
        i <= markdown.length - 2 &&
        markdown[i] === "!" &&
        markdown[i + 1] === "("
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          result += "!(";
          i += 2;
          continue;
        }

        if (!insideTag) {
          // Opening tag
          insideTag = true;
          tagStart = i + 2; // Start after !(
          i += 2;
        } else {
          // This shouldn't happen with this syntax, treat as regular text
          result += markdown[i];
          i++;
        }
      }
      // Check if we're at a potential )! sequence (closing)
      else if (
        i <= markdown.length - 2 &&
        markdown[i] === ")" &&
        markdown[i + 1] === "!" &&
        insideTag
      ) {
        // Check if it's escaped (preceded by backslash)
        if (i > 0 && markdown[i - 1] === "\\") {
          // Don't close the tag, continue collecting content
          i += 2;
          continue;
        }

        // Closing tag
        const content = markdown.substring(tagStart, i);
        result += "<span class='text-red-600 font-bold'>" + content + "</span>";
        insideTag = false;
        tagStart = -1;
        i += 2; // Skip )!
      } else {
        if (!insideTag) {
          result += markdown[i];
        }
        i++;
      }
    }

    // Handle unclosed tag
    if (insideTag) {
      result += "!(" + markdown.substring(tagStart);
    }

    return result;
  }

  textEmojiConvertor(markdown: string): string {
    let found = false;
    let text = "";
    let i = 0;

    while (i < markdown.length) {
      // Check for start pattern ": ("
      if (
        markdown[i] === ":" &&
        i + 2 < markdown.length &&
        markdown[i + 1] === " " &&
        (i === 0 || markdown[i - 1] !== "\\") &&
        markdown[i + 2] === "("
      ) {
        found = true;
        text = ""; // Reset text when starting new emoji pattern
        i += 3; // Skip past ": ("
        continue;
      }

      // If we're inside an emoji pattern, collect the text
      if (found) {
        if (markdown[i] === ")") {
          // Found closing parenthesis - try to replace
          found = false;
          const emoji = this.emojiMap[text];
          if (emoji) {
            // Calculate positions for replacement
            const startPos = i - text.length - 3; // Position of ":"
            markdown =
              markdown.slice(0, startPos) + emoji + markdown.slice(i + 1);
            // Reset index to check from the emoji position
            i = startPos;
          }
          text = ""; // Reset text
        } else {
          // Collect emoji key characters
          text += markdown[i];
        }
      }

      i++;
    }

    return markdown;
  }
}

const convertor = new StringToHtmlConvertor();

export default convertor;
