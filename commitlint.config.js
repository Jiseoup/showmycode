// Commitlint configuration for showmycode.
// Allowed types mirror the branch prefixes documented in CONTRIBUTING.md.
// Note: `i18n` is not part of @commitlint/config-conventional, so we override type-enum.

/** @type {import("@commitlint/types").UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "chore", "refactor", "docs", "test", "i18n"]],
  },
};

module.exports = config;
