const express = require('express');
const session = require('express-session');
const Xu_ly = require('./XL_3L');
const fileupload = require('express-fileupload')

let Ung_dung = express();
Ung_dung.use(session({secret:"123456789"}));
Ung_dung.use(fileupload());
Ung_dung.use(express.urlencoded({extended:false}));
Ung_dung.use("/Media",express.static("../Media"));
Ung_dung.listen(3000);

//Biến toàn cục
Cong_ty = Xu_ly.Doc_Cong_ty();

// Hàm xử lý biến cố
let XL_Khoi_dong = (req,res) => {
    let Khung_HTML = Xu_ly.Doc_Khung_HTML();
    let chuoi_HTML = Xu_ly.Tao_chuoi_HTML_dang_nhap("QLCN_1","QLCN_1");
    chuoi_HTML = Khung_HTML.replace("Chuoi_HTML",chuoi_HTML)
    res.send(chuoi_HTML)
}

let XL_Dang_nhap = (req,res) => {
    let Danh_sach_Quan_ly_chi_nhanh = Xu_ly.Doc_Danh_sach_Quan_ly_chi_nhanh();
    let khung_HTML = Xu_ly.Doc_Khung_HTML();
    let Ten_dang_nhap = req.body.Th_Ten_dang_nhap;
    let Mat_khau = req.body.Th_Mat_khau;
    let chuoiHTML = '';
    let Quan_ly_chi_nhanh = Danh_sach_Quan_ly_chi_nhanh.find(x =>
        x.Ten_Dang_nhap == Ten_dang_nhap && x.Mat_khau == Mat_khau)
    if (Quan_ly_chi_nhanh) {
        Quan_ly_chi_nhanh.Danh_sach_nhan_vien = Xu_ly.Doc_Danh_sach_Nhan_vien(Quan_ly_chi_nhanh);
        Quan_ly_chi_nhanh.Danh_sach_don_vi = Cong_ty.Danh_sach_Don_vi.filter(x=> x.Chi_nhanh.Ma_so == Quan_ly_chi_nhanh.Chi_nhanh.Ma_so)
        req.session.Nguoi_dung = Quan_ly_chi_nhanh;
        Chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Quan_ly(Quan_ly_chi_nhanh)
    } else {
        chuoiHTML = Xu_ly.Tao_chuoi_HTML_dang_nhap("","","Đăng nhập thất bại");
        Chuoi_HTML = khung_HTML.replace("Chuoi_HTML",chuoiHTML)
    }
    res.send(Chuoi_HTML)
}

let XL_Cap_nhat_dien_thoai = (req,res) => {
    let Quan_ly_chi_nhanh = req.session.Nguoi_dung;
    let ma_so_nhan_vien_cap_nhat = req.body.Th_Ma_so_nhan_vien;
    let nhan_vien = Quan_ly_chi_nhanh.Danh_sach_nhan_vien.find(nhan_vien => nhan_vien.Ma_so == ma_so_nhan_vien_cap_nhat)
    nhan_vien.Dien_thoai = req.body.Th_Dien_thoai;
    Xu_ly.Ghi_Nhan_vien(nhan_vien);
    Danh_sach_nhan_vien_xem = [nhan_vien]
    let Chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Quan_ly(Quan_ly_chi_nhanh,Danh_sach_nhan_vien_xem)
    res.send(Chuoi_HTML);
}

let XL_Cap_nhat_dia_chi = (req,res) => {
    let Quan_ly_chi_nhanh = req.session.Nguoi_dung;
    let ma_so_nhan_vien_cap_nhat = req.body.Th_Ma_so_nhan_vien;
    let nhan_vien = Quan_ly_chi_nhanh.Danh_sach_nhan_vien.find(nhan_vien => nhan_vien.Ma_so == ma_so_nhan_vien_cap_nhat);
    //let nhan_vien = req.session.Nguoi_dung;
    nhan_vien.Dia_chi = req.body.Th_Dia_chi;
    Xu_ly.Ghi_Nhan_vien(nhan_vien);
    Danh_sach_nhan_vien_xem = [nhan_vien];
    let Chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Quan_ly(Quan_ly_chi_nhanh,Danh_sach_nhan_vien_xem);
    res.send(Chuoi_HTML);
}

let XL_Cap_nhat_Hinh = (req,res) => {
    let Quan_ly_chi_nhanh = req.session.Nguoi_dung;
    let ma_so_nhan_vien_cap_nhat = req.body.Th_Ma_so_nhan_vien;
    let nhan_vien = Quan_ly_chi_nhanh.Danh_sach_nhan_vien.find(nhan_vien => nhan_vien.Ma_so == ma_so_nhan_vien_cap_nhat);
    //let nhan_vien = req.session.Nguoi_dung;
    let hinh = req.files.Th_Hinh.data;
    Xu_ly.Ghi_Hinh_Nhan_vien(nhan_vien,hinh);
    Danh_sach_nhan_vien_xem = [nhan_vien];
    let Chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Quan_ly(Quan_ly_chi_nhanh,Danh_sach_nhan_vien_xem);
    res.send(Chuoi_HTML);
}

let XL_Bo_sung_ngoai_ngu = (req,res) => {
    let Quan_ly_chi_nhanh = req.session.Nguoi_dung;
    let ma_so_nhan_vien_cap_nhat = req.body.Th_Ma_so_nhan_vien;
    let nhan_vien = Quan_ly_chi_nhanh.Danh_sach_nhan_vien.find(nhan_vien => nhan_vien.Ma_so == ma_so_nhan_vien_cap_nhat);
    //let nhan_vien = req.session.Nguoi_dung;
    let ma_so_ngoai_ngu_can_them = req.body.Th_Ma_so_ngoai_ngu;
    let Ngoai_ngu = Danh_sach_ngoai_ngu.find(Ngoai_ngu => Ngoai_ngu.Ma_so == ma_so_ngoai_ngu_can_them)
    nhan_vien.Danh_sach_Ngoai_ngu.push(Ngoai_ngu)
    Xu_ly.Ghi_Nhan_vien(nhan_vien);
    Danh_sach_nhan_vien_xem = [nhan_vien];
    let Chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Quan_ly(Quan_ly_chi_nhanh,Danh_sach_nhan_vien_xem);
    res.send(Chuoi_HTML);
}

let XL_Tra_cuu = (req,res) => {
    let Quan_ly_chi_nhanh = req.session.Nguoi_dung;
    let Chuoi_tra_cuu = ""
    if (req.query.Chuoi_tra_cuu) {
        Chuoi_tra_cuu = req.query.Chuoi_tra_cuu;
    }
    let Danh_sach_nhan_vien_tra_cuu = Xu_ly.Doc_Danh_sach_Nhan_vien(Quan_ly_chi_nhanh,Chuoi_tra_cuu);
    Chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Quan_ly(Quan_ly_chi_nhanh,Danh_sach_nhan_vien_tra_cuu);
    res.send(Chuoi_HTML);
}

let XL_Bao_cao_don_vi = (req,res) => {
    let Quan_ly_chi_nhanh = req.session.Nguoi_dung;
    let Bao_cao_don_vi = Xu_ly.Lap_Bao_cao_Don_vi(Quan_ly_chi_nhanh);
    let chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Bao_cao_Don_vi(Bao_cao_don_vi);
    res.send(chuoi_HTML);
}

let XL_Bao_cao_ngoai_ngu = (req,res) => {
    let Quan_ly_chi_nhanh = req.session.Nguoi_dung;
    let Bao_cao_ngoai_ngu = Xu_ly.Lap_Bao_cao_Ngoai_ngu(Quan_ly_chi_nhanh);
    let chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Bao_cao_Ngoai_ngu(Bao_cao_ngoai_ngu);
    res.send(chuoi_HTML);
}

let XL_Chuyen_don_vi = (req,res) => {
    let Quan_ly_chi_nhanh = req.session.Nguoi_dung;
    let ma_so_nhan_vien_cap_nhat = req.body.Th_Ma_so_nhan_vien;
    let nhan_vien = Quan_ly_chi_nhanh.Danh_sach_nhan_vien.find(nhan_vien => nhan_vien.Ma_so == ma_so_nhan_vien_cap_nhat);
    //let nhan_vien = req.session.Nguoi_dung;
    let ma_so_don_vi_moi = req.body.Th_Ma_so_don_vi;
    let don_vi_moi = Quan_ly_chi_nhanh.Danh_sach_don_vi.find(don_vi => don_vi.Ma_so == ma_so_don_vi_moi);
    nhan_vien.Don_vi = don_vi_moi;
    Xu_ly.Ghi_Nhan_vien(nhan_vien);
    //nhan_vien.Danh_sach_don_vi_chi_nhanh = Quan_ly_chi_nhanh.Danh_sach_don_vi;
    Danh_sach_nhan_vien_xem = [nhan_vien];
    let Chuoi_HTML = Xu_ly.Tao_chuoi_HTML_Giao_dien_Quan_ly(Quan_ly_chi_nhanh,Danh_sach_nhan_vien_xem);
    res.send(Chuoi_HTML);
}

//Biến cố khởi động
Ung_dung.get("/",XL_Khoi_dong);
Ung_dung.get("/Tra_cuu",XL_Tra_cuu);
Ung_dung.get("/Bao_cao_don_vi",XL_Bao_cao_don_vi);
Ung_dung.get("/Bao_cao_ngoai_ngu",XL_Bao_cao_ngoai_ngu);
Ung_dung.post("/Dang_nhap",XL_Dang_nhap);

// Biến cố thực hiện chức năng
Ung_dung.post("/Cap_nhat_dien_thoai",XL_Cap_nhat_dien_thoai);
Ung_dung.post("/Cap_nhat_dia_chi",XL_Cap_nhat_dia_chi);
Ung_dung.post("/Cap_nhat_hinh",XL_Cap_nhat_Hinh);
Ung_dung.post("/Bo_sung_Ngoai_ngu",XL_Bo_sung_ngoai_ngu);
Ung_dung.post("/Chuyen_don_vi",XL_Chuyen_don_vi);
