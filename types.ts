type ConfigUid = string;

export type Config = {
  uid: ConfigUid;
  host: string;
  username: string;
  password: string;
};

export type CurrentConfig = {
  value: ConfigUid;
};

export type DocumentDefinition = {
  document: any;
  configuration: ConfigUid;
};
