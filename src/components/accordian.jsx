import { useState } from "react";

const Accordion = ({ node }) => {
  const [open, setOpen] = useState(false);

  const hasChildren =
    node.children &&
    node.children.length > 0;
  return (
    <div className="accordion">
      <div
        className="accordion-header flex space-between"
        onClick={() => hasChildren && setOpen((prev) => !prev)}
      >
        <span className="accordion-title">
          {node.title}
        </span>

        {hasChildren && (
          <span
            className={`accordion-icon ${open ? "open" : ""}`}
          >
            ▶
          </span>
        )}
      </div>

      {open && (
        <div className="accordion-body">
          {node.children.map((child) => (
            <Accordion
              key={child.id}
              node={child}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Accordion;