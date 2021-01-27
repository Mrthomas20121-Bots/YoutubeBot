CREATE TABLE warns(
  userID varchar(100) NOT NULL,
  warn_reason varchar(255) NOT NULL,
  channel varchar(255) NOT NULL,
  PRIMARY KEY(userID)
)
CREATE TABLE ban_kick(
  userID varchar(100) NOT NULL,
  reason varchar(255) NOT NULL,
  time_banned varchar(100) NOT NULL,
  channel varchar(255) NOT NULL,
  PRIMARY KEY(userID)
);
CREATE TABLE users(
  id varchar(40) NOT NULL,
  user varchar(255) NOT NULL,
  PRIMARY KEY(userID)
)

ALTER TABLE warns ADD CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES users(id);
ALTER TABLE ban_kick ADD CONSTRAINT fk_bankick_userid FOREIGN KEY (userid) REFERENCES users(id);