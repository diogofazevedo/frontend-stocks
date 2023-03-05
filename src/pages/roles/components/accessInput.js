import React, { useMemo } from "react";

const AccessInput = ({ item, changeAccesses = () => {}, accesses }) => {
  const checked = useMemo(() => {
    return accesses?.find((x) => x.name === item.name) ?? false;
  }, [accesses]);

  return (
    <div className="form-check form-switch switch-input">
      <input
        className="form-check-input p-2"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => {
          changeAccesses(item, e.target.checked);
        }}
      />
      <label className="form-check-label me-3">{item.description}</label>
    </div>
  );
};

export default AccessInput;
