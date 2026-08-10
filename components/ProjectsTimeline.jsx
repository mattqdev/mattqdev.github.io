"use client";
// components/ProjectsTimeline.jsx
// Linear, chronological alternative to the project grid — shows when each
// project happened and how long it ran for.
import Link from "next/link";
import { FaCalendarAlt, FaCodeBranch } from "react-icons/fa";
import { motion } from "framer-motion";

const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

// Parses "Mon YYYY" or "YYYY" into { y, m }. Returns null for anything else
// (some projects use freeform endDate text like "8 Hours later").
function parseDate(str) {
  const s = String(str || "").trim();
  let match = s.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (match) {
    const m = MONTHS[match[1].slice(0, 3).toLowerCase()];
    if (m !== undefined) return { y: parseInt(match[2], 10), m };
  }
  match = s.match(/^(\d{4})$/);
  if (match) return { y: parseInt(match[1], 10), m: 0 };
  return null;
}

function monthsBetween(a, b) {
  return (b.y - a.y) * 12 + (b.m - a.m);
}

function formatDuration(diffMonths) {
  if (diffMonths <= 0) return null;
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ");
}

function getTimelineInfo(project) {
  const start = parseDate(project.startDate);
  const isPresent = project.endDate === "Present";
  const end = isPresent ? null : parseDate(project.endDate);

  let rangeLabel = project.startDate;
  let durationLabel = null;

  if (isPresent) {
    rangeLabel = `${project.startDate} — Present`;
    if (start) {
      const now = new Date();
      const diff = monthsBetween(start, {
        y: now.getFullYear(),
        m: now.getMonth(),
      });
      const duration = formatDuration(diff);
      durationLabel = duration ? `${duration} · ongoing` : "Ongoing";
    }
  } else if (end && start) {
    rangeLabel =
      start.y === end.y && start.m === end.m
        ? project.startDate
        : `${project.startDate} — ${project.endDate}`;
    durationLabel = formatDuration(monthsBetween(start, end));
  } else {
    rangeLabel = `${project.startDate} — ${project.endDate}`;
  }

  return { start, rangeLabel, durationLabel };
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ProjectsTimeline({ projects }) {
  const entries = projects
    .map((project) => ({ project, ...getTimelineInfo(project) }))
    .sort((a, b) => {
      if (!a.start || !b.start) return 0;
      return monthsBetween(a.start, b.start);
    });

  return (
    <div className="timeline">
      <div className="timeline-line" />
      {entries.map(({ project, rangeLabel, durationLabel }) => (
        <motion.div
          key={project.id}
          className="timeline-item"
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span
            className="timeline-dot"
            style={{ background: project.tags[0]?.color || "var(--primary)" }}
          />
          <div className="timeline-content">
            <div className="timeline-date">
              <FaCalendarAlt className="meta-icon" />
              <span>{rangeLabel}</span>
              {durationLabel && (
                <span className="timeline-duration">{durationLabel}</span>
              )}
              {project.isOpenSource && (
                <span className="open-source-tag">
                  <FaCodeBranch className="meta-icon" />
                  <span>OSS</span>
                </span>
              )}
            </div>

            <h3>
              <Link href={`/projects/${project.id}`}>{project.title}</Link>
            </h3>
            <p className="project-description">{project.shortDescription}</p>

            <div className="project-tags">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="project-tag"
                  style={{
                    backgroundColor: tag.color,
                    boxShadow: `0 0 10px ${tag.color}55`,
                  }}
                >
                  {tag.icon} {tag.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
