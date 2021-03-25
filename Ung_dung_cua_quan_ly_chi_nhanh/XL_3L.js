const  fs = require("fs");
const Thu_muc_du_lieu = "../Du_lieu";
const Thu_muc_nhan_vien = Thu_muc_du_lieu + "/Nhan_vien"
const Thu_muc_Quan_ly_chi_nhanh = Thu_muc_du_lieu + "/Quan_ly_chi_nhanh"
const Thu_muc_HTML = Thu_muc_du_lieu + "/HTML"

class XL_3L {
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
            if (Nhan_vien.Don_vi.Chi_nhanh.Ma_so == Quan_ly_chi_nhanh.Chi_nhanh.Ma_so) {
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

    Tao_chuoi_HTML_Giao_dien_Nhan_vien(Nhan_vien) {
        let khungHTML = this.Doc_Khung_HTML();
        let chuoiHTML = this.Tao_chuoi_HTML_Thuc_don(Nhan_vien) + this.Tao_chuoi_HTML_Thong_tin_Nhan_vien(Nhan_vien);
        let Chuoi_HTML = khungHTML.replace("Chuoi_HTML",chuoiHTML)
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

    Tao_chuoi_HTML_Thuc_don(Nhan_vien) {
        let chuoi_thuc_don = `
            <div>
            ${this.Tao_chuoi_HTML_cap_nhat_dien_thoai(Nhan_vien)}
            ${this.Tao_chuoi_HTML_cap_nhat_dia_chi(Nhan_vien)}
            ${this.Tao_chuoi_HTML_cap_nhat_hinh(Nhan_vien)}
            ${this.Tao_chuoi_HTML_bo_sung_ngoai_ngu(Nhan_vien,Danh_sach_ngoai_ngu)}
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