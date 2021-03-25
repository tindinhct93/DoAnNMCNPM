const express = require('express');
const session = require('express-session');
const Xu_ly = require('./XL_3L');
const fileupload = require('express-fileupload')

let Ung_dung = express();
Ung_dung.use(session({secret:"123456789"}));
Ung_dung.use(fileupload());
Ung_dung.use(express.urlencoded({extended:false}));
Ung_dung.use("/Media",express.static("../Media"));
Ung_dung.listen(3001);

//Biến toàn cục
Cong_ty = Xu_ly.Doc_Cong_ty();
Danh_sach_ngoai_ngu = Cong_ty.Danh_sach_Ngoai_ngu

// Hàm xử lý biến cố
let XL_Khoi_dong = (req,res) => {
    let Khung_HTML = Xu_ly.Doc_Khung_HTML();
    let chuoi_HTML = Xu_ly.Tao_chuoi_HTML_dang_nhap("NV_1","NV_1");
    chuoi_HTML = Khung_HTML.replace("Chuoi_HTML",chuoi_HTML)
    res.send(chuoi_HTML)
}

let XL_Dang_nhap = (req,res) => {
    let Danh_sach_nhan_vien = Xu_ly.Doc_Danh_sach_nhan_vien();
    let khung_HTML = Xu_ly.Doc_Khung_HTML();
    let Ten_dang_nhap = req.body.Th_Ten_dang_nhap;
    let Mat_khau = req.body.Th_Mat_khau;
    let chuoiHTML = '';
    let Nhan_vien = Danh_sach_nhan_vien.find(x =>
        x.Ten_Dang_nhap == Ten_dang_nhap && x.Mat_khau == Mat_khau)
    if (Nhan_vien) {
        req.session.Nguoi_dung = Nhan_vien;
        Chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Nhan_vien(Nhan_vien)
    } else {
        chuoiHTML = Xu_ly.Tao_chuoi_HTML_dang_nhap("","","Đăng nhập thất bại");
        Chuoi_HTML = khung_HTML.replace("Chuoi_HTML",chuoiHTML)
    }
    res.send(Chuoi_HTML)
}

let XL_Cap_nhat_dien_thoai = (req,res) => {
    let nhan_vien = req.session.Nguoi_dung;
    nhan_vien.Dien_thoai = req.body.Th_Dien_thoai;
    Xu_ly.Ghi_Nhan_vien(nhan_vien);
    let chuoiHTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Nhan_vien(nhan_vien);
    res.send(chuoiHTML);
}

let XL_Cap_nhat_dia_chi = (req,res) => {
    let nhan_vien = req.session.Nguoi_dung;
    nhan_vien.Dia_chi = req.body.Th_Dia_chi;
    Xu_ly.Ghi_Nhan_vien(nhan_vien);
    let chuoiHTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Nhan_vien(nhan_vien);
    res.send(chuoiHTML);
}

let XL_Cap_nhat_Hinh = (req,res) => {
    let nhan_vien = req.session.Nguoi_dung;
    let hinh = req.files.Th_Hinh.data;
    Xu_ly.Ghi_Hinh_Nhan_vien(nhan_vien,hinh);
    let chuoiHTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Nhan_vien(nhan_vien);
    res.send(chuoiHTML);
}

let XL_Bo_sung_ngoai_ngu = (req,res) => {
    let nhan_vien = req.session.Nguoi_dung;
    let ma_so_ngoai_ngu_can_them = req.body.Th_Ma_so_ngoai_ngu;
    let Ngoai_ngu = Danh_sach_ngoai_ngu.find(Ngoai_ngu => Ngoai_ngu.Ma_so == ma_so_ngoai_ngu_can_them)
    nhan_vien.Danh_sach_Ngoai_ngu.push(Ngoai_ngu)
    Xu_ly.Ghi_Nhan_vien(nhan_vien);
    let chuoiHTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Nhan_vien(nhan_vien);
    res.send(chuoiHTML);
}

//Biến cố khởi động
Ung_dung.get("/",XL_Khoi_dong);
Ung_dung.post("/Dang_nhap",XL_Dang_nhap);

// Biến cố thực hiện chức năng
Ung_dung.post("/Cap_nhat_dien_thoai",XL_Cap_nhat_dien_thoai);
Ung_dung.post("/Cap_nhat_dia_chi",XL_Cap_nhat_dia_chi);
Ung_dung.post("/Cap_nhat_hinh",XL_Cap_nhat_Hinh);
Ung_dung.post("/Bo_sung_Ngoai_ngu",XL_Bo_sung_ngoai_ngu);

