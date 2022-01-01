import wink, { Bow, Model, Tokens } from "wink-nlp";

export default function withModel(model: Model) {
    return function summarize(text: string) {
        const nlp = wink(model);
        const { its, as } = nlp;
        const document = nlp.readDoc(text);

        // Get lemmatized counts of words
        const counts: Record<string, number> = {};
        document.tokens().filter(
            (t) => t.out(its.type) === 'word' && !t.out(its.stopWordFlag)
        ).each(token => {
            const lemma = token.out(its.lemma);
            if (!counts[lemma]) {
                counts[lemma] = 1;
            } else {
                counts[lemma]++;
            }
        });

        // Get and score sentences
        const sentences = document.sentences();
        const scores: [string, number][] = [];

        sentences.each(sentence => {
            let score = 0;
            sentence.tokens().each(token => { 
                const lemma = token.out(its.lemma);

                if (counts[lemma]) {
                    score += counts[lemma];
                };

            });

            scores.push([sentence.out(), score]);
        });
        
        const sorted = scores.sort((a, b) => b[1] - a[1]);
        return sorted.map(s => s[0]);
    };
};
