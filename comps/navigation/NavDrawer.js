import React, { useContext } from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import Link from "next/link";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import HowToVoteOutlined from "@material-ui/icons/HowToVoteOutlined";
import HelpOutline from "@material-ui/icons/HelpOutline";
import LockOpenOutlined from "@material-ui/icons/LockOpenOutlined";
import { useRouter } from "next/router";
import UserContext from "../auth/UserContext";

import styles from "./NavBar.module.css";
import PowerSettingsNewOutlined from "@material-ui/icons/PowerSettingsNewOutlined";
import Button from "@material-ui/core/Button";
import useLogin from "../auth/useLogin";
import AccountTreeOutlined from "@material-ui/icons/AccountTreeOutlined";

const NavDrawer = ({ open, setOpen }) => {
  const router = useRouter();
  const user = useContext(UserContext);
  const { signIn } = useLogin();

  const closeDrawer = () => setOpen(false);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor={"right"}>
      <List>
        <div className={styles.drawerHeading}>
          {!user.signedIn && (
            <div>
              <p>You're not signed in</p>
              <Button
                color={"primary"}
                variant={"outlined"}
                fullWidth
                onClick={signIn}
                startIcon={<LockOpenOutlined />}
              >
                Sign In
              </Button>
            </div>
          )}

          {user.signedIn && (
            <div>
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
                color={"primary"}
                variant={"outlined"}
                fullWidth
                onClick={user.logout}
                startIcon={<PowerSettingsNewOutlined />}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>

        <br />

        {user.signedIn && user.adminPrivileges && (
          <Link href={"/admin"}>
            <ListItem
              button
              selected={router.asPath.startsWith("/admin")}
              onClick={closeDrawer}
            >
              <ListItemIcon>
                <AccountTreeOutlined />
              </ListItemIcon>
              <ListItemText primary={"Admin Panel"} />
            </ListItem>
          </Link>
        )}

        <Link href={"/"}>
          <ListItem
            button
            selected={router.asPath === "/"}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <HomeOutlined />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
        </Link>

        <Link href={"/election"}>
          <ListItem
            button
            selected={router.asPath.startsWith("/election")}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <HowToVoteOutlined />
            </ListItemIcon>
            <ListItemText primary={"Elections"} />
          </ListItem>
        </Link>

        <Link href={"/faq"}>
          <ListItem
            button
            selected={router.asPath.startsWith("/faq")}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <HelpOutline />
            </ListItemIcon>
            <ListItemText primary={"FAQs"} />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default NavDrawer;
