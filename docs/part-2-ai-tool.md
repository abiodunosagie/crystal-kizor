# Part 2: AI product thinking

**Studio COKA Site Brief: a climate-responsive starting brief for anyone planning to build.**

**What it does.** A visitor describes their plot and plans: location, size, who will use it, budget range and what bothers them today (heat, generator costs, dark rooms). The tool returns a one-page starting brief: the climate they are designing for, the passive strategies that matter most (shading, cross-ventilation, orientation, local materials such as laterite) and the questions an architect will ask next.

**Who it is for.** Homeowners, developers and institutions considering a project with Studio COKA, most of whom do not yet know what climate-responsive design could save them.

**The problem it solves.** Enquiries arrive with vague ideas, so first meetings are spent educating. The brief turns a casual visitor into a prepared client and gives the studio a structured enquiry instead of "please call me".

**How it is used.** A short form, a brief in about twenty seconds, then download it or send it to the studio as an enquiry.

**Technology.** Claude Sonnet through the Anthropic API, because it follows long instructions reliably and produces structured output. Climate data comes from a real source (Open-Meteo or NASA POWER for temperature, humidity and solar data by coordinates), not from the model. Next.js on Cloudflare Workers, Supabase for saved briefs.

**First version.** Two weeks: the form, the climate lookup, a system prompt written with Crystal from the studio's own design principles and journal, structured JSON output rendered into the brief, enquiry hand-off by email.

**Risks and safeguards.** The tool never gives structural, cost or regulatory advice; every brief says it is a starting point, not a design. Prompts and outputs are reviewed by the studio weekly. Personal data is stored only when the visitor sends the brief. Rate limiting and abuse checks on the endpoint.
