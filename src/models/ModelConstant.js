const xRight = (key, endPoint) => {
  if (!endPoint) endPoint = key;
  return { key, endPoint };
};
export const _accessRights = [
  {
    className: `Dashboard`,
    ns: `dashboard`,
    rights: [xRight(`list`)],
  },
  {
    className: `Customer`,
    ns: `customer`,
    rights: [
      xRight(`global`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`addTag`),
      xRight(`removeTag`),
      xRight(`addLog`),
      xRight(`deleteLog`),
      xRight(`getCustomerAppointments`),
      xRight(`getCustomerContacts`),
      xRight(`addCustomerContact`),
      xRight(`updateCustomerContact`),
      xRight(`deleteCustomerContact`),
      xRight(`addActivity`),
      xRight(`updateActivity`),
      xRight(`deleteActivity`),
      xRight(`pendingActivity`),
      xRight(`completeActivity`),
      xRight(`fcrActivity`),
    ],
  },
  {
    className: `Contact`,
    ns: `contact`,
    rights: [
      xRight(`global`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`active`),
      xRight(`inactive`),
      xRight(`delete`)
    ],
  },
  {
    className: `CustomerActivity`,
    ns: `customerActivity`,
    rights: [
      xRight(`global`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`myCustomerActivities`),
    ],
  },
  {
    className: `CustomerLog`,
    ns: `customerLog`,
    rights: [xRight(`global`), xRight(`list`), xRight(`customerLogs`)],
  },
  {
    className: `EmailLog`,
    ns: `emailLog`,
    rights: [xRight(`list`)],
  },
  {
    className: `Appointment`,
    ns: `appointment`,
    rights: [
      xRight(`global`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`getAppointmentContacts`),
      xRight(`addAppointmentContact`),
      xRight(`updateAppointmentContact`),
      xRight(`deleteAppointmentContact`),
    ],
  },
  {
    className: `Sales`,
    ns: `sales`,
    rights: [
      xRight(`global`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`addItem`),
      xRight(`createInvoice`),
      xRight(`updateItem`),
      xRight(`removeItem`),
    ],
  },
  {
    className: `Campaign`,
    ns: `campaign`,
    rights: [
      xRight(`global`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`addTag`),
      xRight(`removeTag`),
      xRight(`addForm`),
      xRight(`updateForm`),
      xRight(`createContact`),
      xRight(`createLeadContact`),
      xRight(`closeSubmission`),
    ],
  },
  //
  {
    className: `CompanyProfile`,
    ns: `companyProfile`,
    rights: [xRight(`global`), xRight(`get`), xRight(`update`)],
  },
  {
    className: `AccessRole`,
    ns: `accessRole`,
    rights: [
      { key: `list`, endPoint: `list` },
      { key: `create`, endPoint: `add` },
      { key: `get`, endPoint: `get` },
      { key: `update`, endPoint: `update` },
      xRight(`addRight`),
      xRight(`deleteRight`),
    ],
  },
  {
    className: `User`,
    ns: `user`,
    rights: [
      xRight(`basicList`),
      xRight(`list`),
      { key: `get`, endPoint: `get` },
      { key: `update`, endPoint: `update` },
      { key: `uploadProfilePic`, endPoint: `uploadProfilePic` },
      { key: `connectGoogleCalendar`, endPoint: `connectGoogleCalendar` },

      xRight(`assignRole`),
    ],
  },
  {
    className: `Team`,
    ns: `team`,
    rights: [xRight(`global`), xRight(`list`), xRight(`get`), xRight(`add`), xRight(`update`)],
  },
  {
    className: `CustomerGroup`,
    ns: `customerGroup`,
    rights: [
      xRight(`global`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`addItem`),
      xRight(`updateItem`),
      xRight(`removeItem`),
    ],
  },
  {
    className: `ActivityType`,
    ns: `activityType`,
    rights: [xRight(`global`), xRight(`list`), xRight(`get`), xRight(`add`), xRight(`update`)],
  },
  {
    className: `Tag`,
    ns: `tag`,
    rights: [xRight(`global`), xRight(`list`), xRight(`get`), xRight(`add`), xRight(`update`)],
  },
  {
    className: `Item`,
    ns: `item`,
    rights: [xRight(`global`), xRight(`list`), xRight(`get`), xRight(`add`), xRight(`update`)],
  },
  {
    className: `EmailTemplate`,
    ns: `emailTemplate`,
    rights: [
      xRight(`global`),
      xRight(`emailLog`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`active`),
      xRight(`inactive`),
      xRight(`send`),
      xRight(`uploadAttachment`),
      xRight(`deleteAttachment`),
    ],
  },
  {
    className: `WhatsappTemplate`,
    ns: `whatsappTemplate`,
    rights: [
      xRight(`global`),
      xRight(`whatsappLog`),
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`active`),
      xRight(`inactive`),
      xRight(`send`),
    ],
  },
  {
    className: `AccessLog`,
    ns: `accessLog`,
    rights: [xRight(`global`), xRight(`list`)],
  },
  //
  {
    className: `DocShare`,
    ns: `docShare`,
    rights: [xRight(`listBasicUser`), xRight(`listBasicTeam`), xRight(`list`), xRight(`add`)],
  },
  {
    className: `AuditLog`,
    ns: `auditLog`,
    rights: [{ key: `list`, endPoint: `list` }],
  },
  {
    className: `AccessRights`,
    ns: `accessRight`,
    rights: [{ key: `list`, endPoint: `list` }],
  },
  {
    className: `TelegramAuth`,
    ns: `telegramAuth`,
    rights: [
      { key: `list`, endPoint: `list` },
      { key: `create`, endPoint: `add` },
      { key: `get`, endPoint: `get` },
      { key: `update`, endPoint: `update` },
    ],
  },
  {
    className: `System`,
    ns: `system`,
    rights: [
      xRight(`global`),
      xRight(`listUser`),
      xRight(`listTeam`),
      xRight(`addTeamRightsByUserDoc`),
      xRight(`uploadCustomerCsv`),
      xRight(`applyCustomerCsv`),
      xRight(`downloadUsageReport`),
      xRight(`generateUsageReport`),
    ],
  },
  {
    className: `Export`,
    ns: `export`,
    rights: [xRight(`export`)],
  },
  {
    className: `Automation`,
    ns: `automation`,
    rights: [
      xRight(`list`),
      xRight(`get`),
      xRight(`add`),
      xRight(`update`),
      xRight(`active`),
      xRight(`inactive`),
      xRight(`uploadAttachment`),
      xRight(`deleteAttachment`),
    ],
  },
  {
    className: `Facebook Pages`,
    ns: `facebook`,
    rights: [
      xRight(`facebookConnect`),
      xRight(`list`),
      xRight(`showAllForms`),
      xRight(`subscribePage`),
      xRight(`getAllLeads`),
      xRight(`getLeadData`),
      xRight(`addCustomer`),
    ],
  },
  {
    className: `Xero`,
    ns: `xero`,
    rights: [
      xRight(`xeroConnect`),
      xRight(`createInvoice`),
    ],
  },
  {
    className: `Import Log`,
    ns: `importLog`,
    rights: [
      xRight(`list`),
      xRight(`add`),
    ],
  },
  {
    className: `LinkedIn Pages`,
    ns: `linkedin`,
    rights: [
      xRight(`linkedinConnect`),
    ],
  },
];

export const validateRight = (className, key) => {
  const classObj = _accessRights.find((r) => r.className === className);
  if (!classObj) return false;
  const right = classObj.rights.find((r) => r.key === key);
  if (!right) return false;
  return true;
};
export const getAccessRight = (subNsStart, endPoint) => {
  console.log(`getAccessRight?`, subNsStart, endPoint);
  // const classObj = _accessRights.find((r) => subNsStart.startsWith(r.ns));

  const classObj = _accessRights.find((r) => subNsStart === r.ns);
  if (!classObj) return null;
  const right = classObj.rights.find((r) => r.endPoint === endPoint);
  if (!right) return null;
  right.className = classObj.className;
  right.ns = classObj.ns;
  return right;
};
export const _salesPurposes = [`Sales`];
export const _inventoryPolicy = [`FIFO`, `Specific`];
