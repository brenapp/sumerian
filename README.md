# Sumerian

An implementation of the [SMMRY algorithm](https://smmry.com/about), using
[winkNLP](https://winkjs.org).

## Usage

The module exports a single default function, which curries around a winkNLP language model, shown
here as a `wink-eng-lite-model`, which is not recommended for web. See [WinkNLP](https://winkjs.org/wink-nlp/getting-started.html) for
more information.

```TypeScript
const model = require("wink-eng-lite-model");
import withModel from "smmry";
const summarize = withModel(model);

const document = "This is a test document.";

// Get a 3 sentence summary
const summary = summarize(document).slice(0, 3);

console.log(summary.join(" "));

```
