import React, { useContext } from "react";
import { toast } from "react-toastify";

import BasicModal from "../../common/modal/basicModal";
import LoadingContext from "../../../context/loadingContext";
import { getGroupLink } from "../../../services/groupsService";

const LeaderboardInviteModal = ({ isOpen, setIsOpen, group, competition }) => {
  const { setLoading } = useContext(LoadingContext);

  const copyInviteLink = async () => {
    setLoading(true);
    const res = await getGroupLink(group._id, competition._id);
    if (res.status === 200) {
      navigator.clipboard.writeText(window.location.origin + res.data.link);
      toast.success("Link copied to clipboard");
    } else toast.error(res.body);
    setLoading(false);
  };

  return (
    <BasicModal
      isOpen={isOpen}
      onClose={setIsOpen}
      header={<div className="standout-header">{group.name}</div>}
    >
      <button className="btn btn-block btn-info" onClick={copyInviteLink}>
        Copy Invite Link to Clipboard
      </button>
    </BasicModal>
  );
};

export default LeaderboardInviteModal;
