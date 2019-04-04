import React from "react";
import PropTypes from "prop-types";

export const DisplayOutcomes = ({ outcomes }) => {
  const rows = [
    outcomes.slice(0, 3).filter(o => o.length !== 0),
    outcomes.slice(4, 7).filter(o => o.length !== 0)
  ];

  return (
    <>
      {rows.map((r, n) => (
        <>
          {r.length > 0 && (
            <div key={n.toString()}>
              {r.map((o, i) => (
                <div key={i.toString() + n.toString()}>{o}</div>
              ))}
            </div>
          )}
        </>
      ))}
    </>
  );
};

DisplayOutcomes.propTypes = {
  outcomes: PropTypes.array.isRequired
};
