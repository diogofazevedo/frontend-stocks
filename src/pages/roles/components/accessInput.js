import React, { useMemo } from "react";

const AccessInput = ({ index, item, changeAccesses = () => {}, accesses }) => {
  const checked = useMemo(() => {
    return accesses.find((x) => x.name === item.name) ?? false;
  }, [accesses]);

  return (
    <div key={index} className="form-check form-switch access-input">
      <input
        class="form-check-input p-2"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => {
          changeAccesses(item, e.target.checked);
        }}
      />
      <label class="form-check-label me-3">{item.description}</label>
    </div>
  );
};

export default AccessInput;
