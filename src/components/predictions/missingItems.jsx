import React, { useState, useEffect, useContext, useRef } from "react";

import BasicModal from "../common/modal/basicModal";
import { renderInfoLine } from "../../utils/textUtils";

const MissingItems = ({ items, isOpen, setIsOpen }) => {
  return (
    <BasicModal
      isOpen={isOpen}
      onClose={setIsOpen}
      header={
        <h3>
          <b>Missing Items</b>
        </h3>
      }
    >
      <div className="text-center">
        <p className="custom-alert danger">
          Submissions with missing items can be saved and completed later.
          <br />
          If the submission is not completed before the deadline it will be
          scored as is.
        </p>
        {items.map((item, idx) =>
          renderInfoLine(item.label, item.text, "", idx)
        )}
      </div>
    </BasicModal>
  );
};

export default MissingItems;
