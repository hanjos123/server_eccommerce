const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
require("dotenv").config();

const {
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS,
    DOMAIN_NAME,
    DOMAIN_API
} = process.env;

const oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
);

function dateNow() {
    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    today = dd + "/" + mm + "/" + yyyy;
    return today;
}

//sendmail
async function sendmail(
    cart,
    product,
    name,
    email,
    address,
    phone,
    tracsactionId
) {
    oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
    });

    const accessToken = oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: SENDER_EMAIL_ADDRESS,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    //logo
    let sum = 0;
    let html2 = `<table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" id="m_2616422498092473585backgroundTable">
    <tbody>
    <tr>
        <td>
            <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                <tbody>
                <tr>
                    <td width="100%">
                        <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tbody>
                            <tr>
                                <td>
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tbody>
                                        
                                        <tr>
                                            <td align="center"><img src="https://theme.hstatic.net/1000378196/1000788468/14/logo.png?v=59" width="140" height="auto" style="width:25%;height:auto" class="CToWUd"></td>
                                        </tr>
                                        
                                        
                                        
                                        <tr>
                                            <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                                        </tr>
                                        
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody></table>`;
    //Text xác nhận đơn hàng
    html2 += `<table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" id="m_2616422498092473585backgroundTable">
    <tbody>
    <tr>
        <td>
            <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                <tbody>
                <tr>
                    <td width="100%">
                        <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tbody>
                            
                            <tr>
                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                            </tr>
                            
                            <tr>
                                <td>
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tbody>
                                        

<tr>
    <td style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left;line-height:18px">
        Xin chào ${name},
    </td>
</tr>


    <tr>
        <td width="100%" height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
    </tr>


<tr>
    <td style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left;line-height:18px">

        Đơn hàng <a href="${DOMAIN_NAME}/order/${tracsactionId}" style="text-decoration:none;color:#ff5722">#${tracsactionId}</a> của bạn đã được đặt thành công vào ngày ngày ${dateNow()}. Nhấn vào nút bên dưới để xác nhận đơn hàng <br><br>

    </td>
</tr>


    <tr>
        <td width="100%" height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
    </tr>


<tr>
    <td colspan="2">
        <table border="0" cellspacing="0" cellpadding="0" align="center">
            <tbody><tr>
                <td bgcolor="#EE4D2D" style="padding:8px 30px 8px 30px;border-radius:3px" align="center"><a href="${DOMAIN_NAME}/order/confirm/${tracsactionId}" style="font-size:14px;font-family:Helvetica,Arial,sans-serif;font-weight:normal;color:#ffffff;text-decoration:none;display:inline-block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://shopee.vn/universal-link/user/purchase/order/104905724249240/?shopid%3D454185064%26deep_and_deferred%3D1%26smtt%3D580.71543669.7&amp;source=gmail&amp;ust=1652411922966000&amp;usg=AOvVaw17Xfqhmj2jCAiChscK_qdX">
                        Xác nhận đơn hàng </a></td>
            </tr>
        </tbody></table>
    </td>
</tr>

    <tr>
        <td width="100%" height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
    </tr>


                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" height="1" bgcolor="#ffffff" style="font-size:1px;line-height:1px">&nbsp;</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>`;
    html2 += `<div style="width:100%;height:1px;display:block" align="center">
    <div style="width:100%;max-width:600px;height:1px;border-top:1px solid #e0e0e0"></div>
</div>`;
    html2 += `<table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" id="m_1745737228369728562backgroundTable">
    <tbody>
    <tr>
        <td>
            <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                <tbody>
                <tr>
                    <td width="100%">
                        <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tbody>
                            
                            <tr>
                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                            </tr>
                            
                            <tr>
                                <td>
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tbody>
                                        
    
    <tr>
        <td colspan="2" style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:16px;font-weight:bold;height:10px"></td>
    </tr>
    <tr>
        <td colspan="2" style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:13px;font-weight:bold">
            THÔNG TIN ĐƠN HÀNG - DÀNH CHO NGƯỜI MUA
        </td>
    </tr>
    
    
    <tr>
        <td height="" style="font-size:1px;line-height:1px" width="100%">&nbsp;</td>
    </tr>
    
    
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" height="1" bgcolor="#ffffff" style="font-size:1px;line-height:1px">&nbsp;</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>`;
    product.forEach(function (pro, i) {
        sum += cart.Inventory[i].Quantity * pro.Price;
        html2 += `<table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" id="m_1745737228369728562backgroundTable">
    <tbody>
    <tr>
        <td>
            <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                <tbody>
                <tr>
                    <td width="100%">
                        <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tbody>
                            
                            <tr>
                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                            </tr>
                            
                            <tr>
                                <td>
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tbody>
                                        
        
        <tr><td><table width="560" align="center" border="0" cellpadding="0" cellspacing="0">
            <tbody>
            
            <tr>
                <td width="560" height="140" align="left">
                    <a href="${DOMAIN_NAME}/products/${pro.Product_slug}">
                        <img src="${DOMAIN_API}/uploads/${pro.Product_image[0]}" alt="" border="0" width="140" height="140" style="display:block;border:none;outline:none;text-decoration:none" class="CToWUd">
                    </a>
                </td>
            </tr>
            
            </tbody>
        </table>
        
        
        <table align="left" border="0" cellpadding="0" cellspacing="0">
            
    <tbody><tr>
        <td width="100%" height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
    </tr>

        </tbody></table>
        
        
        <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed">
            <tbody><tr>
                <td colspan="2" width="" height="20" style="font-size:1px;line-height:1px">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="2" style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left">
                    
                        ${parseInt(i) + 1}. ${pro.Product_name}
                </td>
            </tr>

                <tr>
                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top" width="49%">Size: </td>
                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top" width="49%">${cart.Inventory[i].Size
            }</td>
                </tr>
                <tr>
                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top" width="49%">Số lượng: </td>
                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top" width="49%">${cart.Inventory[i].Quantity
            }</td>
                </tr>
                
                <tr>
                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top" width="49%">Giá: </td>
                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top" width="49%">${Intl.NumberFormat().format(
                cart.Inventory[i].Quantity * pro.Price
            )}₫</td>
                </tr>

             
            
    <tr>
        <td width="100%" height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
    </tr>

        </tbody></table>
        
        
                                        </td></tr></tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" height="1" bgcolor="#ffffff" style="font-size:1px;line-height:1px">&nbsp;</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>`;
    });
    html2 += `<div style="width:100%;height:1px;display:block" align="center">
<div style="width:100%;max-width:600px;height:1px;border-top:1px solid #e0e0e0"></div>
</div>`;
    html2 += `<table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" id="m_1745737228369728562backgroundTable">
    <tbody>
    <tr>
        <td>
            <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                <tbody>
                <tr>
                    <td width="100%">
                        <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tbody>
                            
                            <tr>
                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                            </tr>
                            
                            <tr>
                                <td>
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tbody>
                                        
        <tr><td><table width="560" align="center" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed">
            <tbody><tr>
                <td colspan="2" style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:16px;font-weight:bold;height:10px"></td>
            </tr>

            
            <tr>
                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top" width="49%">Tổng thanh toán:
                </td>
                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top" width="49%">${Intl.NumberFormat().format(
        sum
    )}
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:16px;font-weight:bold;height:10px"></td>
            </tr>
            
            <tr>
                <td colspan="2" style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:16px;font-weight:bold;height:10px"></td>
            </tr>
            
            
            
        </tbody></table>
        
                                        </td></tr></tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" height="1" bgcolor="#ffffff" style="font-size:1px;line-height:1px">&nbsp;</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>`;

    let mailOptions = {
        from: "LEVENTS <leventsphake@gmail.com>",
        to: email,
        subject: "LEVENTS - Xác nhận đơn hàng",
        html: html2,
        /* template: 'mail' */
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log("Message sent!");
        }
    });
}

async function sendOpinion(msg, mail) {
    oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
    });

    const accessToken = oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: SENDER_EMAIL_ADDRESS,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    html = `<table width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f6f7">
    <tbody><tr><td height="50"></td></tr>
    <tr>
        <td align="center" valign="top">
            
            <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #f1f2f5">
                <tbody><tr>
                    <td colspan="3" height="60" bgcolor="#ffffff" style="border-bottom:1px solid #eeeeee;padding-left:16px" align="left">
                        
                            <img src="https://theme.hstatic.net/1000378196/1000788468/14/logo.png?v=59" width="140" height="80" style="display:block;width:140px;height:80px" class="CToWUd">
                        
                    </td>
                </tr>
                <tr><td colspan="3" height="20"></td></tr>
                <tr>
                    <td width="20"></td>
                    <td align="left">
                        
                        <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody><tr><td colspan="3" height="20"></td></tr>
                            <tr><td colspan="3"><p style="font-family:Helvetica,Arial,sans-serif">
    ${msg}
</p>

<table>
    
</tbody></table>

<p style="font-family:Helvetica,Arial,sans-serif">
    Thanks,<br><br>
    Levents
</p>
</td></tr>
                            <tr><td colspan="3" height="20"></td></tr>
                            </tbody></table>
                    </td>
                    <td width="20"></td>
                </tr>
                <tr><td colspan="3" height="20"></td></tr>
            </tbody></table>
        </td>
    </tr>
    <tr>
        <td height="50">
            
        </td>
    </tr>
</tbody></table>`;
    let mailOptions = {
        from: "LEVENTS <leventsphake@gmail.com>",
        to: mail,
        subject: "LEVENTS - Phản hồi quý khách",
        html: html,
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log("Message sent!");
        }
    });
}

async function sendChangePassword(msg, mail) {
    console.log(msg);
    console.log(mail);
    oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
    });

    const accessToken = oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: SENDER_EMAIL_ADDRESS,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    html = `<table width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f6f7">
    <tbody><tr><td height="50"></td></tr>
    <tr>
        <td align="center" valign="top">
            
            <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #f1f2f5">
                <tbody><tr>
                    <td colspan="3" height="60" bgcolor="#ffffff" style="border-bottom:1px solid #eeeeee;padding-left:16px" align="left">
                        
                            <img src="https://theme.hstatic.net/1000378196/1000788468/14/logo.png?v=59" width="140" height="80" style="display:block;width:140px;height:80px" class="CToWUd">
                        
                    </td>
                </tr>
                <tr><td colspan="3" height="20"></td></tr>
                <tr>
                    <td width="20"></td>
                    <td align="left">
                        
                        <table cellpadding="0" cellspacing="0" width="100%">
                            <tbody><tr><td colspan="3" height="20"></td></tr>
                            <tr><td colspan="3"><p style="font-family:Helvetica,Arial,sans-serif">
    ${msg}
</p>

<table>
    
</tbody></table>

<p style="font-family:Helvetica,Arial,sans-serif">
    Thanks,<br><br>
    Levents
</p>
</td></tr>
                            <tr><td colspan="3" height="20"></td></tr>
                            </tbody></table>
                    </td>
                    <td width="20"></td>
                </tr>
                <tr><td colspan="3" height="20"></td></tr>
            </tbody></table>
        </td>
    </tr>
    <tr>
        <td height="50">
            
        </td>
    </tr>
</tbody></table>`;
    let mailOptions = {
        from: "LEVENTS <leventsphake@gmail.com>",
        to: 'dangthevinh12@gmail.com',
        subject: "LEVENTS - Liên Kết Đổi Mật Khẩu",
        html: html,
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log("Message sent!");
        }
    });
}


module.exports = { sendmail, sendOpinion, sendChangePassword };
