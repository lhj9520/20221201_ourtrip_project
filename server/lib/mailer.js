const nodeMailer = require("nodemailer");

module.exports = async (email, vericode) => {
  const transporter = await nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com", // gmail server
    port: 587,
    secure: false,
    auth: {
      user: process.env.REACT_APP_GMAIL_ADDRESS,
      pass: process.env.REACT_APP_GMAIL_PASSWORD,
    },
  });

  const mailOption = {
    from: { name: "우리의여행", address: process.env.REACT_APP_GMAIL_ADDRESS },
    to: email,
    subject: "요청하신 인증번호를 알려드립니다.",
    html: `
    <h1>요청하신 인증번호를 알려드립니다.</h1>
    <div>
        <h3>아래의 인증번호를 인증번호 입력창에 입력해 주세요.</h3>
        <h3>인증번호 : ${vericode}</h3>
    </div>`,
  };

  try {
    await transporter.sendMail(mailOption);
    return "success";
  } catch (error) {
    return error;
  }
};
