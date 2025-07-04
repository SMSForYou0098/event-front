import React, { useState, useContext, memo, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Accordion, useAccordionButton, AccordionContext, Tooltip, OverlayTrigger, } from "react-bootstrap";
import { ArtistIcon, BookingsIcon, DashboardIcon, EventIcon, FooterIcon, HomeIcon, NavMenuIcon, OTPLockIcon, PagesIcon, PaymentWalletIcon, PromoIcon, ReportIcon, RoleIcon, ScanIcon, SettingIcon, SmsIcon, SocialMediaIcon, TaxesIcon, UsersIcon, MailIcon } from "./NavIcons";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowLeftRight, Castle, Code, FerrisWheel, School, Users, WalletIcon } from "lucide-react";
import { useMyContext } from "../../../../Context/MyContextProvider";
import SidebarMenu from "../../components/sidebar/sidebar-menu";

function CustomToggle({ children, eventKey, onClick }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(eventKey, (active) =>
    onClick({ state: !active, eventKey: eventKey })
  );

  const isCurrentEventKey = activeEventKey === eventKey;
  return (
    <Link
      to="#"
      aria-expanded={isCurrentEventKey ? "true" : "false"}
      className="nav-link"
      role="button"
      onClick={(e) => {
        decoratedOnClick(isCurrentEventKey);
      }}
    >
      {children}
    </Link>
  );
}

const VerticalNav = memo(() => {
  const { UserPermissions } = useMyContext()
  const [activeMenu, setActiveMenu] = useState(false);

  const [active, setActive] = useState("");

  const SubMenuArrow = () => (
    <svg
      className="icon-18"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>

  )


  let location = useLocation();

  const menuConfig = [
    // Dashboard Menu
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      permission: "Dashboard",
    },

    // Users Menu (Accordion with Submenus)
    {
      title: "Users",
      icon: <UsersIcon />,
      permission: "View User",
      isAccordion: true,
      eventKey: "sidebar-user",
      subMenus: [
        {
          title: "User List",
          path: "/dashboard/users",
          permission: "View User",
          minititle: "UL",
        },
      ],
    },
    //event menu group
    {
      title: "Events",
      icon: <EventIcon />,
      isAccordion: true,
      permission: "View Event Modules",
      eventKey: "sidebar-event",
      subMenus: [
        {
          title: "Events",
          path: "/dashboard/events",
          permission: "View Event",
          icon: <EventIcon />,
        },
        // Additional Menus
        {
          title: "Online",
          path: "/dashboard/bookings-admin",
          permission: "View Total Bookings",
          icon: <BookingsIcon />,
        },
        {
          title : 'Sponsor',
          path : '/dashboard/sponsor-bookings',
          permission : 'View Sponsor Bookings',
          icon : <BookingsIcon />
        },
        {
          title : 'Accreditation',
          path : '/dashboard/accreditation-bookings',
          permission : 'View Accreditation Bookings',
          icon : <BookingsIcon />
        },
        {
          title : 'Box Office',
          path : '/dashboard/box-office',
          permission : 'View Box Office',
          icon : <Castle size={16}/>
        },
        {
          title: 'Agent',
          path: "/dashboard/agent-bookings",
          permission: "View Agent Bookings",
          icon: <BookingsIcon />,
        },
        {
          title: "Wallet Agent",
          path: "/dashboard/wallet-agent",
          permission: "View Wallet Agent",
          icon: <WalletIcon size={16} />,
        },
        {
          title: "Transactions",
          path: "/dashboard/user-transactions",
          permission: "View Transactions",
          icon: <ArrowLeftRight size={16} />,
        },
        // {
        //   title: "Shop Scanner",
        //   path: "/dashboard/shop-scanner",
        //   permission: "View Agent Bookings",
        //   icon: <ScanIcon size={16}/>,
        // },
        {
          permission: "View POS Bookings",
          title: "POS",
          path: "/dashboard/pos-bookings",
          icon: <BookingsIcon />,
        },
        {
          permission: "View Exhibition Bookings",
          title: "Exhibition",
          path: "/dashboard/exhibition",
          icon: <School size={18} />,
        },
        {
          title: "Pending",
          path: "/dashboard/pending-bookings",
          permission: "View Total Bookings",
          icon: <BookingsIcon />,
        },
        {
          title: "Attendees",
          path: "/dashboard/attendees",
          icon: <UsersIcon />,
          permission: "View Attendees",
          eventKey: "Attendees",
        },
        {
          title: "Complimentary",
          path: "/dashboard/complimentary-bookings",
          permission: "View Complimentary Booking",
          icon: <BookingsIcon />,
        },
        {
          permission: "View Promocodes",
          title: "Promo Codes",
          path: "/dashboard/promo-code",
          icon: <PromoIcon />,
        },
      ]
    },
    {
      title: "Amusement Park",
      permission: "View Amusement Modules",
      isAccordion: true,
      icon: <FerrisWheel size={20} />,
      eventKey: "sidebar-amusement",
      subMenus: [
        {
          title: "Online",
          path: "/dashboard/amusement/online-bookings",
          permission: "View Event",
        },
        {
          title: "Agent",
          path: "/dashboard/amusement/agent-bookings",
          permission: "View Event",
        },
        {
          title: "POS",
          path: "/dashboard/amusement/pos-bookings",
          permission: "View Event",
        },
      ],
    },




    // Scanner Accordion Menu
    {
      title: "Scan Ticket",
      permission: ["Scan By Camera", "Scan By Scanner"],
      isAccordion: true,
      icon: <ScanIcon />,
      eventKey: "Scanner",
      subMenus: [
        {
          title: "Scan by Scanner",
          path: "/dashboard/scan/scanner",
          permission: "Scan By Scanner"
        },
        {
          title: "Scan by Camera",
          path: "/dashboard/scan/camera",
          permission: "Scan By Camera"
        },
      ],
    },
    //contact us data list
        {
      title: "User Inquiries",
      path: "/dashboard/user-inquiry",
      permission: "View User Inquiries",
      icon: <MailIcon />,
    },
    // Commission and Taxes
    {
      title: "Commission & Taxes",
      path: "/dashboard/tax",
      permission: "Commision & Taxes",
      icon: <TaxesIcon />,
    },
    {
      title: "Payment Log",
      path: "/dashboard/payment-log",
      permission: "View Payment Logs",
      icon: <Code size={16} />,
    },
    {
      title: "Live Users",
      path: "/dashboard/live-users",
      permission: "View Live Users",
      icon: <Users size={16} />,
    },
    // Roles Menu
    {
      title: "Roles",
      path: "/dashboard/roles",
      permission: "View Role",
      icon: <RoleIcon />,
    },
    // Setting Accordion Menu
    {
      title: "Settings",
      permission: ['View Mail Config Setting', 'Edit Mail Config Setting', 'View SMS Config Setting', 'Edit SMS Config Setting', 'Custom SMS Config Setting', 'View Payment Config Setting', 'Edit Payment Config Setting', 'Create SMS Template Setting'],
      isAccordion: true,
      icon: <SettingIcon />,
      eventKey: "sidebar-settings",
      subMenus: [
        {
          title: "Mail Configuration",
          path: "/dashboard/settings/mail",
          minititle: "MC",
          permission: "View Mail Config Setting",
          icon: <MailIcon />
        },
        {
          title: "SMS Gateway",
          path: "/dashboard/settings/sms-gateway",
          minititle: "SG",
          permission: "View SMS Config Setting",
          icon: <SmsIcon />
        },
        {
          title: "Whatsapp Config",
          path: "/dashboard/settings/whatsapp-config",
          minititle: "WA",
          permission: "View SMS Config Setting",
          icon: <FaWhatsapp size={18} />
        },
        {
          title: "Payment Gateway",
          path: "/dashboard/settings/payment-gateway",
          minititle: "PG",
          permission: "View Payment Config Setting",
          icon: <PaymentWalletIcon />
        },
        {
          title: "Admin Settings",
          path: "/dashboard/settings/admin",
          permission: "View Admin Setting",
          icon: <SettingIcon />,
        },
        {
          title: "Home Settings",
          path: "/dashboard/settings/home-setting",
          minititle: "AS",
          permission: "View Admin Setting",
          icon: <HomeIcon />,
        },
        {
          title: "Pages",
          path: "/dashboard/settings/pages",
          minititle: "PGS",
          permission: "View Admin Setting",
          icon: <PagesIcon />
        },
        {
          title: "Artist",
          path: "/dashboard/settings/artist",
          minititle: "ART",
          permission: "View Admin Setting",
          icon: <ArtistIcon />
        },
        {
          title: "Nav Menu",
          path: "/dashboard/settings/nav-menu",
          minititle: "AS",
          permission: "View Admin Setting",
          icon: <NavMenuIcon />
        },
        {
          title: "Category",
          path: "/dashboard/settings/category",
          minititle: "CTG",
          permission: "View Admin Setting",
          icon: <EventIcon />
        },
        {
          title: "Attendee Fields",
          path: "/dashboard/settings/attendee-fields",
          minititle: "AF",
          permission: "View Admin Setting",
          icon: <UsersIcon />
        },

        {
          title: "Social Media",
          path: "/dashboard/settings/social-media",
          minititle: "SM",
          permission: "View Admin Setting",
          icon: <SocialMediaIcon />
        },
        {
          title: "OTP",
          path: "/dashboard/settings/otp",
          minititle: "OTP",
          permission: "View Admin Setting",
          icon: <OTPLockIcon />
        },
        {
          title: "Footer",
          path: "/dashboard/settings/footer",
          minititle: "FTR",
          permission: "View Admin Setting",
          icon: <FooterIcon />
        },
      ],
    },
    // reports
    {
      title: "Reports",
      permission: ["View Event Reports", "View Scanner Reports", "View Agent Reports", "View POS Reports"],
      isAccordion: true,
      icon: <ReportIcon />,
      eventKey: "sidebar-reports",
      subMenus: [
        {
          title: "Event Reports",
          path: "/dashboard/reports/event-report",
          permission: "View Event Reports",
          permissions: "View Event Reports",
        },
        {
          title: "Scanner Reports",
          path: "/dashboard/reports/scanner-report",
          permission: "View Scanner Reports",
          permissions: "View Scanner Reports",
        },
        {
          title: "Agent Reports",
          path: "/dashboard/reports/agent-report",
          permission: "View Agent Reports",
          permissions: "View Agent Reports",
        },
        {
          title: "POS Reports",
          path: "/dashboard/reports/pos-report",
          permission: "View POS Reports",
          permissions: "View POS Reports",
        },
      ],
    }

  ];

  return (
    <Fragment>
      <Accordion as="ul" className="navbar-nav iq-main-menu">
        {menuConfig.map((menu, index) => {
          const hasPermission = Array.isArray(menu.permission)
            ? menu.permission.some((perm) => UserPermissions?.includes(perm))
            : menu.permission
              ? UserPermissions?.includes(menu.permission)
              : true;

          if (!hasPermission) return null;

          return menu.isAccordion ? (
            <Accordion.Item
              as="li"
              key={index}
              eventKey={menu.eventKey}
              bsPrefix={`nav-item ${menu.subMenus.some(
                (subMenu) => location.pathname === subMenu.path
              ) ? "active" : ""}`}
              onClick={() => setActive(menu.eventKey)}
            >
              <CustomToggle eventKey={menu.eventKey}
                onClick={(e) => {
                  if (activeMenu !== menu.eventKey) {
                    setActiveMenu(menu.eventKey);
                  }
                }}
              >
                <OverlayTrigger placement="right" overlay={<Tooltip>{menu.title}</Tooltip>}>
                  <i className="icon">{menu?.icon}</i>
                </OverlayTrigger>
                <span className="item-name">{menu.title}</span>
                <i className="right-icon"><SubMenuArrow /></i>
              </CustomToggle>

              <Accordion.Collapse eventKey={menu.eventKey}>
                <ul className="sub-nav">
                  {menu.subMenus.map((subMenu, subIndex) => (
                    UserPermissions?.includes(subMenu.permission) && (
                      <SidebarMenu
                        key={subIndex}
                        isTag="false"
                        staticIcon={!subMenu?.icon && "true"}
                        pathname={subMenu.path}
                        title={subMenu.title}
                        minititle={subMenu.minititle}
                      >
                        <i className="icon">{subMenu?.icon}</i>
                      </SidebarMenu>
                    )
                  ))}
                </ul>
              </Accordion.Collapse>
            </Accordion.Item>
          ) : (
            <SidebarMenu
              key={index}
              isTag="true"
              pathname={menu.path}
              title={menu.title}
            >
              <i className="icon">{menu?.icon}</i>
            </SidebarMenu>
          );
        })}
      </Accordion>
    </Fragment>
  );

});

VerticalNav.displayName = "VerticalNav";
export default VerticalNav;
