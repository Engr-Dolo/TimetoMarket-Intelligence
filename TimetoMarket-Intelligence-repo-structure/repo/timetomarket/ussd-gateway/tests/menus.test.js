const { handleUssd, SCREENS } = require("../src/menus");

const SESSION = { sessionId: "test-001", phoneNumber: "+231700000000" };

describe("USSD menu — entry", () => {
  test("empty text returns main menu as CON", () => {
    const res = handleUssd({ ...SESSION, text: "" });
    expect(res).toMatch(/^CON/);
    expect(res).toContain("1. Sell produce");
    expect(res).toContain("2. Buy produce");
  });
});

describe("USSD menu — depth 1 (main menu selections)", () => {
  test("1 → sell menu", () => {
    const res = handleUssd({ ...SESSION, text: "1" });
    expect(res).toMatch(/^CON/);
    expect(res).toContain("Sell Produce");
  });

  test("2 → buy menu", () => {
    const res = handleUssd({ ...SESSION, text: "2" });
    expect(res).toMatch(/^CON/);
    expect(res).toContain("Buy Produce");
  });

  test("3 → my listings menu", () => {
    const res = handleUssd({ ...SESSION, text: "3" });
    expect(res).toMatch(/^CON/);
    expect(res).toContain("My Listings");
  });

  test("0 → exits session", () => {
    const res = handleUssd({ ...SESSION, text: "0" });
    expect(res).toMatch(/^END/);
  });

  test("invalid input → ends session", () => {
    const res = handleUssd({ ...SESSION, text: "9" });
    expect(res).toMatch(/^END/);
    expect(res).toContain("Invalid");
  });
});

describe("USSD menu — depth 2 (sell sub-flow)", () => {
  test("1*1 → prompts for crop name", () => {
    const res = handleUssd({ ...SESSION, text: "1*1" });
    expect(res).toMatch(/^CON/);
    expect(res.toLowerCase()).toContain("crop");
  });

  test("1*0 → returns to main menu", () => {
    const res = handleUssd({ ...SESSION, text: "1*0" });
    expect(res).toBe(SCREENS.main);
  });
});

describe("USSD menu — depth 2 (buy sub-flow)", () => {
  test("2*2 → prompts for crop search term", () => {
    const res = handleUssd({ ...SESSION, text: "2*2" });
    expect(res).toMatch(/^CON/);
    expect(res.toLowerCase()).toContain("crop");
  });

  test("2*0 → returns to main menu", () => {
    const res = handleUssd({ ...SESSION, text: "2*0" });
    expect(res).toBe(SCREENS.main);
  });
});

describe("USSD screen length constraint", () => {
  test("all SCREENS fit within 160 characters", () => {
    Object.entries(SCREENS).forEach(([name, text]) => {
      expect(text.length).toBeLessThanOrEqual(160);
    });
  });
});
