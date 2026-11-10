# KOBAGS version 64 review on GitHub Pages

The root https://ariongj.github.io/mo/ displays the October 26 version 64 website.
Open the designer directly at https://ariongj.github.io/mo/#/design.

GitHub Pages hosts the small presentation shell (`index.html`, `review-v64.css`, `review-v64.js`).
The working v64 application, including its server-rendered routes, still runs at
https://kobags-october-review.ariongj.chatgpt.site/ and is displayed in a full-window frame.
This is **not** a standalone static export of the application or a migration of its CMS data.
The review copy has isolated storage; production customer records and administrator credentials were not copied.

The application permits framing of public pages by this GitHub origin only; CMS, private approval routes and APIs retain same-origin framing protection.
The frame sends only its public pathname and page title to update the shareable review URL. It does not send form drafts or artwork data to the parent.
If a browser prevents embedded storage, use the direct application URL above. A direct-open fallback is also shown while the application is loading.

Neither kobags-group.com nor kobags.itdks.tech is changed by this Pages publication. They remain on version 94.

## Previous builder and rollback

- The previous builder remains at [builder-before-v64.html](builder-before-v64.html).
- The full pre-change repository is preserved on branch `codex/before-v64-review-20261110`, commit `385ce957fdb8947babdac9d2490c54dad5cbf96a`.
- To roll back Pages, restore `index.html` and README from that branch with a new commit. Do not force-push or change either website domain.
- The original `landing.html` and other repository files are retained.

## Original builder documentation

# KOBAGS 3D bag configurator

Interactive 3D preview of non-woven PP bags for KOBAGS: box bag, handle bag, D-cut bag, T-shirt bag
and string (drawstring) bag, each in the standard sizes and minimum order quantities from the size sheet.

- **Start from a sample:** 19 real KOBAGS products, including the "Enhance your brand" and
  "Put your brand in their hand" bags, the "Thank you" T-shirt bags and a two-sided kraft bag.
- **Design both sides:** add text, logos (1-colour ink or full colour) and QR codes to the front and
  the back separately, and drag them into place on a flat view of the printable area.
- **Choose:** bag type (box, handle, D-cut, T-shirt, string, bottle), standard size, fabric colour, handle colour.

Open `builder-before-v64.html` in a browser, or view the published page via GitHub Pages.
Built with three.js 0.169 and qrcode-generator 1.4.4 (loaded from jsDelivr). No build step.
