import pathModule from "path";
export const parseNameAndPath = (input: string) => {
  const paths = input.split("/");

  let appName = paths[paths.length - 1];

  // If the user ran `npx create-t3-app .` or similar, the appName should be the current directory
  if (appName === ".") {
    const parsedCwd = pathModule.resolve(process.cwd());
    appName = pathModule.basename(parsedCwd);
  }

  // If the first part is a @, it's a scoped package
  const indexOfDelimiter = paths.findIndex((p) => p.startsWith("@"));
  if (paths.findIndex((p) => p.startsWith("@")) !== -1) {
    appName = paths.slice(indexOfDelimiter).join("/");
  }

  const path = paths.filter((p) => !p.startsWith("@")).join("/");

  return [appName, path] as const;
};
