// components/brand/Mark.jsx
// The MattQ monogram in its brand forms (see brand-manual.html):
//  - StudioTile: solid white mark inside the safelight tile → MattQ Studios (Tier B)
//  - MarkLine + Signal: outlined mark followed by one red dot → @mattqdev (Tier A)
// One geometry for every form — never redraw or stretch it.

export const MARK_PATH =
  "M248 263H318L540 455L762 263H832V817H764L572 640L674 555V618L736 670V410L540 580L344 410V670L406 618V555L508 640L316 817H248Z";

export function MarkSolid({ className, title }) {
  return (
    <svg
      className={className}
      viewBox="240 255 600 570"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
      focusable="false"
    >
      <path d={MARK_PATH} fill="currentColor" />
    </svg>
  );
}

// `weight` is the stroke in mark units (stem = 96). The manual uses 12 above
// 96 px and 22 (bold) from 24 to 96 px.
export function MarkLine({ className, weight = 12, title }) {
  const pad = weight + 8;
  return (
    <svg
      className={className}
      viewBox={`${248 - pad} ${263 - pad} ${584 + pad * 2} ${554 + pad * 2}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
      focusable="false"
    >
      <path
        d={MARK_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function StudioTile({ className = "", title }) {
  return (
    <span className={`studio-tile ${className}`}>
      <MarkSolid title={title} />
    </span>
  );
}
