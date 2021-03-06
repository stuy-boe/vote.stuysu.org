import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import styles from "./NavBar.module.css";
import Popover from "@material-ui/core/Popover";
import UserContext from "../auth/UserContext";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

const UserMenuItem = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useContext(UserContext);

  return (
    <>
      <Button
        disableRipple
        className={styles.menuItem}
        onClick={(ev) => setAnchorEl(anchorEl ? null : ev.target)}
        endIcon={<ArrowDropDown />}
      >
        Hi {user.firstName}
      </Button>

      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onBackdropClick={() => setAnchorEl(null)}
      >
        <div className={styles.userItemPopover}>
          <p>
            You're signed in as: <b>{user.name}</b>
          </p>
          <p>
            Email: <b>{user.email}</b>
          </p>
          <p>
            Graduation Year: <b>{user.gradYear}</b>
          </p>
          <p>
            Grade: <b>{user.grade}</b>
          </p>
          <Button
            fullWidth
            variant={"outlined"}
            color={"primary"}
            onClick={user.logout}
          >
            Sign Out
          </Button>
        </div>
      </Popover>
    </>
  );
};

export default UserMenuItem;
