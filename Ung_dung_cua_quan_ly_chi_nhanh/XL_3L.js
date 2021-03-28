const  fs = require("fs");
const Thu_muc_du_lieu = "../Du_lieu";
const Thu_muc_nhan_vien = Thu_muc_du_lieu + "/Nhan_vien"
const Thu_muc_Quan_ly_chi_nhanh = Thu_muc_du_lieu + "/Quan_ly_chi_nhanh"
const Thu_muc_HTML = Thu_muc_du_lieu + "/HTML"

class XL_3L {
    //Xử lý lưu trữ
    Doc_Khung_HTML () {
        let Duong_dan = Thu_muc_HTML+"/Khung.html";
        let chuoi_HTML = fs.readFileSync(Duong_dan,"utf-8");
        return chuoi_HTML;
    }

    Doc_Cong_ty () {
        let Duong_dan = Thu_muc_du_lieu+"/Cong_ty/Cong_ty.json";
        let chuoi_JSON = fs.readFileSync(Duong_dan,'utf-8');
        let Cong_ty = JSON.parse(chuoi_JSON);
        return Cong_ty
    }

    Doc_Danh_sach_Quan_ly_chi_nhanh () {
        let Danh_sach = []
        let Danh_sach_tep = fs.readdirSync(Thu_muc_Quan_ly_chi_nhanh);
        Danh_sach_tep.forEach(tep => {
            let Duong_dan = Thu_muc_Quan_ly_chi_nhanh + "/" + tep;
            let chuoiJSON = fs.readFileSync(Duong_dan,"utf-8");
            let Quan_ly_chi_nhanh = JSON.parse(chuoiJSON);
            Danh_sach.push(Quan_ly_chi_nhanh);
        })
        return Danh_sach;
    }

    Doc_Danh_sach_Nhan_vien (Quan_ly_chi_nhanh, chuoi_tra_cuu = "") {
        let Danh_sach = []
        let Danh_sach_tep = fs.readdirSync(Thu_muc_nhan_vien);
        Danh_sach_tep.forEach(tep => {
            let Duong_dan = Thu_muc_nhan_vien + "/" + tep;
            let chuoiJSON = fs.readFileSync(Duong_dan,"utf-8");
            let Nhan_vien = JSON.parse(chuoiJSON);
            if (Nhan_vien.Don_vi.Chi_nhanh.Ma_so == Quan_ly_chi_nhanh.Chi_nhanh.Ma_so && Nhan_vien.Ho_ten.includes(chuoi_tra_cuu)) {
                Danh_sach.push(Nhan_vien);
            }
        })
        return Danh_sach;
    }

    Ghi_Nhan_vien (Nhan_vien) {
        let Duong_dan = Thu_muc_nhan_vien + "/" + Nhan_vien.Ma_so + ".json";
        let Chuoi_JSON = JSON.stringify(Nhan_vien);
        fs.writeFileSync(Duong_dan,Chuoi_JSON);
    }

    Ghi_Hinh_Nhan_vien(Nhan_vien,Hinh) {
        let Duong_dan = `../Media/${Nhan_vien.Ma_so}.png`;
        fs.writeFileSync(Duong_dan,Hinh);
    }

    // Xử lý nghiệp vụ
    Lap_Bao_cao_Don_vi(Quan_ly_chi_nhanh) {
        let Bao_cao = {};
        Bao_cao.Tieu_de = "Thống kê số nhân viên theo đơn vị";
        Bao_cao.Danh_sach_chi_tiet = [];
        let Danh_sach_don_vi = Quan_ly_chi_nhanh.Danh_sach_don_vi;
        let Danh_sach_nhan_vien = Quan_ly_chi_nhanh.Danh_sach_nhan_vien;
        Danh_sach_don_vi.forEach(Don_vi => {
            let Chi_tiet = {};
            Chi_tiet.Ten_don_vi = Don_vi.Ten;
            let So_nhan_vien = 0;
            Danh_sach_nhan_vien.forEach(nhan_vien => {
                if (nhan_vien.Don_vi.Ma_so == Don_vi.Ma_so) {
                    So_nhan_vien ++;
                }
            })
            Chi_tiet.So_nhan_vien = So_nhan_vien;
            let Ty_le_nhan_vien = So_nhan_vien*100/Danh_sach_nhan_vien.length;
            Chi_tiet.Ty_le_nhan_vien = Ty_le_nhan_vien.toFixed(2);
            Bao_cao.Danh_sach_chi_tiet.push(Chi_tiet);
        })
        return Bao_cao
    }

    Lap_Bao_cao_Ngoai_ngu(Quan_ly_chi_nhanh) {
        let Bao_cao = {};
        Bao_cao.Tieu_de = "Thống kê số nhân viên theo ngoại ngữ";
        Bao_cao.Danh_sach_chi_tiet = {};
        let Danh_sach_Ngoai_ngu = Cong_ty.Danh_sach_Ngoai_ngu;
        let Danh_sach_nhan_vien = Quan_ly_chi_nhanh.Danh_sach_nhan_vien;
        Danh_sach_Ngoai_ngu.forEach(Ngoai_ngu => {
            let MS_ngoai_ngu = Ngoai_ngu.Ma_so;
            Bao_cao.Danh_sach_chi_tiet[MS_ngoai_ngu] = {So_luong :0, Ten: Ngoai_ngu.Ten};
        })
        Danh_sach_nhan_vien.forEach(nhan_vien => {
            let DS_Ngoai_ngu = nhan_vien.Danh_sach_Ngoai_ngu;
            DS_Ngoai_ngu.forEach(Ngoai_ngu => {
                let Ma_so_NgoaiNgu = Ngoai_ngu.Ma_so;
                Bao_cao.Danh_sach_chi_tiet[Ma_so_NgoaiNgu].So_luong ++;
            })
        })
        let So_luong_nhan_vien = Danh_sach_nhan_vien.length;
        for (let Ngoai_ngu in  Bao_cao.Danh_sach_chi_tiet) {
            let Ty_le = Bao_cao.Danh_sach_chi_tiet[Ngoai_ngu].So_luong / So_luong_nhan_vien * 100;
            Bao_cao.Danh_sach_chi_tiet[Ngoai_ngu].Ty_le = Ty_le.toFixed(2);
        }
        return Bao_cao
    }


    // Xử lý giao diện
    Tao_chuoi_HTML_dang_nhap(Ten_dang_nhap= "",Mat_khau="",Thong_bao = "") {
        let chuoi_HTML = `<form action="/Dang_nhap" method="post">
              <label for="fname">Tên nhân viên</label><br>
              <input type="text" id="fname" name="Th_Ten_dang_nhap" value="${Ten_dang_nhap}"><br>
              <label for="lname">Mật Khẩu</label><br>
              <input type="password" id="lname" name="Th_Mat_khau" value="${Mat_khau}"><br><br>
              <input type="submit" value="Đăng nhập">
              <div>${Thong_bao}</div>
              </form>`
        return chuoi_HTML
    }

    Tao_chuoi_HTML_Thuc_don_Chinh() {
        let chuoi_thuc_don = `
            <div class="btn">
            <a class="btn btn-danger" href="/Tra_cuu">Tra cứu nhân viên</a>
            <a class="btn btn-danger" href="/Bao_cao_don_vi">Xem báo cáo đơn vị</a>
            <a class="btn btn-danger" href="/Bao_cao_ngoai_ngu">Xem báo cáo ngoại ngữ</a>
            </div>`;
        return chuoi_thuc_don
    }

    Tao_chuoi_HTML_Giao_dien_Quan_ly(Quan_ly, Danh_sach_nhan_vien=Quan_ly.Danh_sach_nhan_vien) {
        let khungHTML = this.Doc_Khung_HTML();
        let chuoiHTML = this.Tao_chuoi_HTML_Thuc_don_Chinh() + this.Tao_chuoi_HTML_DSNV(Danh_sach_nhan_vien);
        let Chuoi_HTML = khungHTML.replace("Chuoi_HTML",chuoiHTML)
        return Chuoi_HTML;
    }

    Tao_chuoi_HTML_Giao_dien_Bao_cao_Don_vi(Bao_cao_don_vi) {
        let khungHTML = this.Doc_Khung_HTML();
        let chuoiHTML = this.Tao_chuoi_HTML_Thuc_don_Chinh() + this.Tao_chuoi_HTML_Bao_cao_Don_vi(Bao_cao_don_vi) ;
        let Chuoi_HTML = khungHTML.replace("Chuoi_HTML",chuoiHTML)
        return Chuoi_HTML;
    }
    Tao_chuoi_HTML_Bao_cao_Don_vi(Bao_cao_don_vi) {
        let ChuoiHTML = `<div class="alert alert-info" style="margin:10px">${Bao_cao_don_vi.Tieu_de}</div>`;
        ChuoiHTML += `
            <div class="row" style="margin: 10px">
                <div class="col-md-2 btn btn-info">Đơn vị</div>
                <div class="col-md-2 btn btn-info">Số lượng</div>
                <div class="col-md-2 btn btn-info">Tỷ lệ</div>
            </div>`
        Bao_cao_don_vi.Danh_sach_chi_tiet.forEach(Chi_tiet => {
            ChuoiHTML += `
            <div class="row" style="margin: 10px">
                <div class="col-md-2 style="align="center">${Chi_tiet.Ten_don_vi}</div>
                <div class="col-md-2 style="align="center">${Chi_tiet.So_nhan_vien}</div>
                <div class="col-md-2 style="align="center">${Chi_tiet.Ty_le_nhan_vien}</div>
            </div>`
        })
        return ChuoiHTML
    }

    Tao_chuoi_HTML_Giao_dien_Bao_cao_Ngoai_ngu (Bao_cao_don_vi) {
        let khungHTML = this.Doc_Khung_HTML();
        let chuoiHTML = this.Tao_chuoi_HTML_Thuc_don_Chinh() + this.Tao_chuoi_HTML_Bao_cao_Ngoai_ngu(Bao_cao_don_vi) ;
        let Chuoi_HTML = khungHTML.replace("Chuoi_HTML",chuoiHTML)
        return Chuoi_HTML;
    }


    Tao_chuoi_HTML_Bao_cao_Ngoai_ngu(Bao_cao_ngoai_ngu) {
        let ChuoiHTML = `<div class="alert alert-info" style="margin:10px">${Bao_cao_ngoai_ngu.Tieu_de}</div>`;
        ChuoiHTML += `
            <div class="row" style="margin: 10px">
                <div class="col-md-2 btn btn-info">Ngoại ngữ</div>
                <div class="col-md-2 btn btn-info">Số lượng</div>
                <div class="col-md-2 btn btn-info">Tỷ lệ</div>
            </div>`
        for (let Ngoai_ngu in  Bao_cao_ngoai_ngu.Danh_sach_chi_tiet) {
            ChuoiHTML += `
            <div class="row" style="margin: 10px">
                <div class="col-md-2 style="align="center">${Bao_cao_ngoai_ngu.Danh_sach_chi_tiet[Ngoai_ngu].Ten}</div>
                <div class="col-md-2 style="align="center">${Bao_cao_ngoai_ngu.Danh_sach_chi_tiet[Ngoai_ngu].So_luong}</div>
                <div class="col-md-2 style="align="center">${Bao_cao_ngoai_ngu.Danh_sach_chi_tiet[Ngoai_ngu].Ty_le}</div>
            </div>`
        }
        return ChuoiHTML
    }

    Tao_chuoi_HTML_DSNV(Danh_sach_Nhan_vien) {
        let Chuoi_HTML ="";
        let chuoiHTML_traCuu = `<form action="/Tra_cuu" method="get">
                <input type="text" name="Chuoi_tra_cuu" />
                <input type="submit" value="Tra cứu">
                ${Danh_sach_Nhan_vien.length}
        </form>`
        Chuoi_HTML += chuoiHTML_traCuu
        Danh_sach_Nhan_vien.forEach(Nhan_vien => {
            Chuoi_HTML +=  this.Tao_chuoi_HTML_Giao_dien_Nhan_vien(Nhan_vien);
        })
        return Chuoi_HTML;
    }

    Tao_chuoi_HTML_Giao_dien_Nhan_vien(Nhan_vien) {
        //let khungHTML = this.Doc_Khung_HTML();
        let chuoi_thong_tin = `
            <div class="alert alert-primary" data-toggle="collapse" data-target="#Thuc_don_${Nhan_vien.Ma_so}">
                ${this.Tao_chuoi_HTML_Thong_tin_Nhan_vien(Nhan_vien)}
            </div>
        `
        let chuoi_thuc_don =  ` <div id="Thuc_don_${Nhan_vien.Ma_so}" class="collapse">${this.Tao_chuoi_HTML_Thuc_don(Nhan_vien)}</div>`
        let Chuoi_HTML = chuoi_thuc_don + chuoi_thong_tin;
        return Chuoi_HTML;
    }

    Tao_chuoi_HTML_cap_nhat_dien_thoai (Nhan_vien) {
        let chuoi_Click = `<div data-toggle="dropdown" class="btn btn-primary">Cập nhật điện thoại</div>`
        let chuoi_Dropdown = `<div class="dropdown-menu" style="width:200%">
            <form action="/Cap_nhat_dien_thoai" method="post">
                <input name="Th_Ma_so_nhan_vien" value=${Nhan_vien.Ma_so} type ="hidden">
                <input name="Th_Dien_thoai" type="text" required value="${Nhan_vien.Dien_thoai}" style="width:90%"/>
                <div class="alert">
                    <button class="btn btn-danger" type="submit">Đồng ý</button>                
                </div>
              </form>
            </div>`
        let Chuoi_chuc_nang = `<div class ="dropdown btn">${chuoi_Click}${chuoi_Dropdown}</div>`
        return Chuoi_chuc_nang;
    }

    Tao_chuoi_HTML_cap_nhat_dia_chi (Nhan_vien) {
        let chuoi_Click = `<div data-toggle="dropdown" class="btn btn-primary">Cập nhật địa chỉ</div>`
        let chuoi_Dropdown = `<div class="dropdown-menu" style="width:200%">
            <form action="/Cap_nhat_dia_chi" method="post">
                <input name="Th_Ma_so_nhan_vien" value=${Nhan_vien.Ma_so} type ="hidden">
                <textarea name="Th_Dia_chi" required cols="25" rows="3" style="width:90%">${Nhan_vien.Dia_chi}</textarea>
                <div class="alert">
                    <button class="btn btn-danger" type="submit">Đồng ý</button>                
                </div>
              </form>
            </div>`
        let Chuoi_chuc_nang = `<div class ="dropdown btn">${chuoi_Click}${chuoi_Dropdown}</div>`
        return Chuoi_chuc_nang;
    }

    Tao_chuoi_HTML_cap_nhat_hinh (Nhan_vien) {
        let chuoi_Click = `<div data-toggle="dropdown" class="btn btn-primary">Cập nhật hình</div>`
        let chuoi_Dropdown = `<div class="dropdown-menu" style="width:200%">
            <form action="/Cap_nhat_hinh" method="post" enctype="multipart/form-data">
                <div class="alert">
                    Cập nhật hình cho nhân viên ${Nhan_vien.Ho_ten}                
                </div>
                 <input name="Th_Ma_so_nhan_vien" value=${Nhan_vien.Ma_so} type ="hidden"/>
                 <input type="file" name="Th_Hinh" accept="image/png"/>
                <div class="alert">
                    <button class="btn btn-danger" type="submit">Đồng ý</button>                
                </div>
              </form>
            </div>`
        let Chuoi_chuc_nang = `<div class ="dropdown btn">${chuoi_Click}${chuoi_Dropdown}</div>`
        return Chuoi_chuc_nang;
    }

    Tao_chuoi_HTML_bo_sung_ngoai_ngu (Nhan_vien) {
        let Danh_sach_ngoai_ngu= Cong_ty.Danh_sach_Ngoai_ngu;
        if (Nhan_vien.Danh_sach_Ngoai_ngu.length ==Danh_sach_ngoai_ngu.length) {
            return ''
        }
        let Danh_sach_bo_sung = [];
        Danh_sach_ngoai_ngu.forEach(Ngoai_ngu => {
            if (!Nhan_vien.Danh_sach_Ngoai_ngu.find(x => x.Ma_so == Ngoai_ngu.Ma_so))
                Danh_sach_bo_sung.push(Ngoai_ngu)
        })
        let chuoi_Click = `<div data-toggle="dropdown" class="btn btn-primary">Bổ sung ngoại ngữ</div>`
        let chuoi_Dropdown = `<div class="dropdown-menu style="width:200%">`
        Danh_sach_bo_sung.forEach(Ngoai_ngu => {
            chuoi_Dropdown += `
            <form action="/Bo_sung_Ngoai_ngu" method="post" class="btn">
                <input name="Th_Ma_so_nhan_vien" value=${Nhan_vien.Ma_so} type ="hidden"/>
                <input name="Th_Ma_so_ngoai_ngu" value=${Ngoai_ngu.Ma_so} type ="hidden"/>
                <button class="btn btn-danger" type="submit">${Ngoai_ngu.Ten}</button>                
              </form>`
        })
        chuoi_Dropdown += `</div>`
        let Chuoi_chuc_nang = `<div class ="dropdown btn">${chuoi_Click}${chuoi_Dropdown}</div>`
        return Chuoi_chuc_nang;
    }

    Tao_chuoi_HTML_Chuyen_don_vi (Nhan_vien) {
        let Danh_sach_don_vi_chuyen = [];
        //let Danh_sach_don_vi = Quan_ly_chi_nhanh.Danh_sach_don_vi;
        let Ma_so_chi_nhanh = Nhan_vien.Don_vi.Chi_nhanh.Ma_so;
        let Danh_sach_don_vi = Cong_ty.Danh_sach_Don_vi.filter(Don_vi => Don_vi.Chi_nhanh.Ma_so == Ma_so_chi_nhanh)
        Danh_sach_don_vi.forEach(Don_vi => {
            if (Nhan_vien.Don_vi.Ma_so != Don_vi.Ma_so) {
                Danh_sach_don_vi_chuyen.push(Don_vi);
            }
        })
        let chuoi_Click = `<div data-toggle="dropdown" class="btn btn-primary">Chuyển đơn vị</div>`
        let chuoi_Dropdown = `<div class="dropdown-menu style="width:200%">`
        Danh_sach_don_vi_chuyen.forEach(Don_vi => {
            chuoi_Dropdown += `
            <form action="/Chuyen_don_vi" method="post" class="btn">
                <input name="Th_Ma_so_nhan_vien" value=${Nhan_vien.Ma_so} type ="hidden"/>
                <input name="Th_Ma_so_don_vi" value=${Don_vi.Ma_so} type ="hidden"/>
                <button class="btn btn-danger" type="submit">${Don_vi.Ten}</button>                
              </form>`
        })
        chuoi_Dropdown += `</div>`
        let Chuoi_chuc_nang = `<div class ="dropdown btn">${chuoi_Click}${chuoi_Dropdown}</div>`
        return Chuoi_chuc_nang;
    }

    Tao_chuoi_HTML_Thuc_don(Nhan_vien) {
        let chuoi_thuc_don = `
            <div>
            ${this.Tao_chuoi_HTML_cap_nhat_dien_thoai(Nhan_vien)}
            ${this.Tao_chuoi_HTML_cap_nhat_dia_chi(Nhan_vien)}
            ${this.Tao_chuoi_HTML_cap_nhat_hinh(Nhan_vien)}
            ${this.Tao_chuoi_HTML_bo_sung_ngoai_ngu(Nhan_vien)}
            ${this.Tao_chuoi_HTML_Chuyen_don_vi(Nhan_vien)}
            </div>`;
        return chuoi_thuc_don
    }

    Tao_chuoi_HTML_Thong_tin_Nhan_vien(Nhan_vien) {
        let chuoi_HTML = '';
        let chuoi_Hinh = `<img src="/Media/${Nhan_vien.Ma_so}.png" style="width: 60px; height: 60px"/>`;
        let chuoi_Ngoai_ngu = "";
        Nhan_vien.Danh_sach_Ngoai_ngu.forEach(ngoai_ngu => {
            chuoi_Ngoai_ngu += ngoai_ngu.Ten + " "
        })
        let chuoi_Thong_tin =`<div class= "btn" style="text-align:left">
            ${Nhan_vien.Ho_ten} ${Nhan_vien.CMND} <br/>
             ${Nhan_vien.Don_vi.Ten} - ${Nhan_vien.Don_vi.Chi_nhanh.Ten}      <br/>
             ${Nhan_vien.Dien_thoai} <br/>
             ${Nhan_vien.Dia_chi} <br/>
             ${chuoi_Ngoai_ngu}
             </div>`
        chuoi_HTML = chuoi_Hinh + chuoi_Thong_tin;
        return chuoi_HTML;
    }

}

module.exports = new XL_3L()