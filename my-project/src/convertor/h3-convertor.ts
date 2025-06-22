class StringToHtmlConvertor {
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
   * Converts markdown bold text to HTML bold text.
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
}

const convertor = new StringToHtmlConvertor();

export default convertor;
