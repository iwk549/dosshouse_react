import { useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify";
import LoadingContext from "../../context/loadingContext";
import { getUsers, deleteUser } from "../../services/adminService";
import Confirm from "../common/modal/confirm";
import IconRender from "../common/icons/iconRender";
import PageSelection from "../common/pageSections/pageSelection";
import SearchBox from "../common/searchSort/searchBox";
import PillSort from "../common/searchSort/pillSort";

const RESULTS_PER_PAGE = 100;

const SORT_COLUMNS = [
  { path: "name", label: "Name" },
  { path: "email", label: "Email" },
  { path: "lastActive", label: "Last Active" },
];

const AdminUsers = () => {
  const { setLoading } = useContext(LoadingContext);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [googleFilter, setGoogleFilter] = useState(undefined);
  const [sortColumn, setSortColumn] = useState({
    path: "lastActive",
    order: "desc",
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const searchTimeout = useRef(null);

  const loadUsers = async (
    selectedPage,
    searchQuery,
    hasGoogleAccount,
    sort,
  ) => {
    setLoading(true);
    const { path, order } = sort;
    const res = await getUsers(
      selectedPage,
      RESULTS_PER_PAGE,
      searchQuery,
      hasGoogleAccount,
      path,
      order,
    );
    if (res.status === 200) {
      setUsers(res.data.users);
      setCount(res.data.count);
    } else toast.error(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers(1, "", undefined, sortColumn);
  }, []);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(
      () => loadUsers(1, value, googleFilter, sortColumn),
      400,
    );
  };

  const handleGoogleFilter = (value) => {
    setGoogleFilter(value);
    setPage(1);
    loadUsers(1, search, value, sortColumn);
  };

  const handleSort = (newSortColumn) => {
    setSortColumn(newSortColumn);
    setPage(1);
    loadUsers(1, search, googleFilter, newSortColumn);
  };

  const handlePageClick = (direction) => {
    const newPage = page + direction;
    setPage(newPage);
    loadUsers(newPage, search, googleFilter, sortColumn);
  };

  const handleSelectPage = (newPage) => {
    setPage(newPage);
    loadUsers(newPage, search, googleFilter, sortColumn);
  };

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteUser(userToDelete._id);
    if (res.status === 200) {
      toast.success("User deleted");
      loadUsers(page, search, googleFilter, sortColumn);
    } else toast.error(res.data);
    setUserToDelete(null);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <SearchBox
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
          />
        </div>
        <button
          className="btn btn-sm btn-dark"
          style={{ flexShrink: 0, marginRight: "15px" }}
          onClick={() => loadUsers(page, search, googleFilter, sortColumn)}
        >
          <IconRender type="refresh" size={14} />
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <PillSort
          onFilter={handleGoogleFilter}
          options={[
            { label: "All", value: undefined },
            { label: "Google", value: true },
            { label: "No Google", value: false },
          ]}
          selectedValue={googleFilter}
        />
        <PillSort
          onSort={handleSort}
          columns={SORT_COLUMNS}
          sortColumn={sortColumn}
        />
      </div>
      {users.map((u) => (
        <div
          key={u._id}
          className="single-card light-bg"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "4px 8px",
            margin: "3px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0 16px",
            }}
          >
            <div className="info-line">
              <span className="info-line-label">Name</span>
              <span className="info-line-value">{u.name}</span>
            </div>
            <div className="info-line">
              <span className="info-line-label">Email</span>
              <span className="info-line-value">{u.email}</span>
            </div>
            <div className="info-line" style={{ borderBottom: "none" }}>
              <span className="info-line-label">Last Active</span>
              <span
                className="info-line-value"
                title={
                  u.lastActive
                    ? new Date(u.lastActive).toLocaleString()
                    : undefined
                }
              >
                {u.lastActive
                  ? new Date(u.lastActive).toLocaleDateString()
                  : "Never"}
              </span>
            </div>
            <div className="info-line" style={{ borderBottom: "none" }}>
              <span className="info-line-label">Google Account</span>
              <span className="info-line-value">
                <IconRender
                  type={u.hasGoogleAccount ? "checkbox" : "checkboxEmpty"}
                  size={20}
                />
              </span>
            </div>
          </div>
          {u.role === "admin" ? (
            <span style={{ marginLeft: "16px" }} title="Site admin">
              <IconRender type="user" size={20} />
            </span>
          ) : (
            <button
              className="btn btn-sm btn-danger"
              style={{ marginLeft: "16px" }}
              title="Delete user"
              onClick={() => setUserToDelete(u)}
            >
              <IconRender type="delete" size={14} />
            </button>
          )}
        </div>
      ))}
      <PageSelection
        totalCount={count}
        displayPerPage={RESULTS_PER_PAGE}
        pageNumber={page}
        onClickCaret={handlePageClick}
        onSelectPage={handleSelectPage}
      />
      <Confirm
        header="Delete User"
        isOpen={!!userToDelete}
        setIsOpen={(v) => !v && setUserToDelete(null)}
        onConfirm={handleDelete}
        buttonText={["Cancel", "Delete"]}
        focus="cancel"
      >
        <p>
          Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
          This cannot be undone.
        </p>
      </Confirm>
    </div>
  );
};

export default AdminUsers;
