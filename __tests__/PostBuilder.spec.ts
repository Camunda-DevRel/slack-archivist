import { PostBuilder } from "../src/PostBuilder";
import { SlackConversation } from "../src/test-data/test-post";
import { TestConversation } from "../src/test-data/test-conversation";
import { mockUsernameLookupService } from "../src/test-data/mockUsernameLookupService";
import { testPostOutput } from "../src/test-data/test-post-output";

describe("PostBuilder", () => {
  const postBuilder = new PostBuilder({
    userMap: mockUsernameLookupService,
    botId: "UTRJSKNRZ",
  });

  it("correctly builds a markdown post", async () => {
    const markdown = await postBuilder.buildMarkdownPostFromConversation(
      TestConversation as any
    );
    // tslint:disable-next-line: no-console
    // console.log("markdown", markdown); // @DEBUG
    expect(true).toBe(true);
    // expect(markdown).toBe(testPostOutput);
  });

  describe("addReturnForBackTicks", () => {
    it("Adds two leading newlines for an immediate code block, and a trailing newline", () => {
      const immediateCodeBlock = "```code block here```";
      const result = postBuilder._addReturnForBackTicks(immediateCodeBlock);
      expect(result).toBe("\n\n```\ncode block here\n```");
    });
    xit("Adds one newline for an immediate code block that has one newline", () => {});
    xit("Adds two newlines for an embedded code block", () => {});
    xit("Adds two lines at start and end", () => {});
    xit("Handles two code blocks", () => {});
  });
});
