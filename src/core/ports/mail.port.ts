type TSendMailProps = {
  to: string;
  subject: string;
  body: string;
};

abstract class MailPort {
  abstract sendMail(mail: TSendMailProps): void;
}

export { MailPort };
