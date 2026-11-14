export function cleanInput(input: string): string[] {
  const tkns = input.trim().split(" ");
  const result = [];

  for (let tkn of tkns) {
    if (tkn != "") {
      result.push(tkn.trim().toLowerCase());
    }
  }

  return result;
}
