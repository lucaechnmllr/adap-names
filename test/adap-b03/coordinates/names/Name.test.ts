import { describe, it, expect } from "vitest";

import { Name } from "../../../../src/adap-b03/names/Name";
import { StringName } from "../../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../../src/adap-b03/names/StringArrayName";
import exp from "constants";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("MyOwn StringName function tests", () => {
  it("test empty input", () => {
    let n: Name = new StringName("");
    expect(n.getNoComponents()).toBe(1);
    n.append("test");
    //console.log(n.asString());
    expect(n.asString()).toBe(".test");
    expect(n.getNoComponents()).toBe(2);
  });
  it("test empty input and remove", () => {
    let n: Name = new StringName("");
    expect(n.getNoComponents()).toBe(1);
    n.remove(0);
    //console.log(n.asString());
    expect(n.asString()).toBe("");
    expect(n.getNoComponents()).toBe(0);
    expect(n.isEmpty()).toBe(true);
  });
  it("test similarity", () => {
    let n: Name = new StringName("oss..fau.de");
    let m: Name = new StringArrayName(["oss", "", "fau", "de"]);
    expect(n.asDataString()).toBe(m.asDataString());
  });
  it("test similarity empty", () => {
    let n: Name = new StringName("");
    let m: Name = new StringArrayName([""]);
    expect(n.asDataString()).toBe(m.asDataString());
    expect(n.getNoComponents()).toBe(m.getNoComponents());
    n.append("a");
    m.append("a");
    expect(n.getNoComponents()).toBe(m.getNoComponents());
    expect(n.asDataString()).toBe(m.asDataString());
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
  it("test asString", () => {
      const n = new StringArrayName(["a\\.\\."]);
      expect(n.asString()).toBe("a..");
    });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});


