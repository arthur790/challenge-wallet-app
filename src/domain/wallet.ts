export type SessionUser = {
  userId: string;
  name: string;
};

export type Movement = {
  id: string;
  title: string;
  amount: number;
  direction: "in" | "out";
  createdAt: string;
};

export type Contact = {
  id: string;
  name: string;
  identifier: string;
};

export type Wallet = {
  user: SessionUser;
  balance: number;
  movements: Movement[];
};
