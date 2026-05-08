#include <iostream>
#include <string>

using namespace std;

class SanPhamViewModel1
{
private:
    string tenSanPham;      // Tên sản phẩm
    double giaBan;          // Giá bán
    string anhMoTa;         // Ảnh mô tả

public:
    // Constructor mặc định
    SanPhamViewModel1()
        : tenSanPham(""), giaBan(0.0), anhMoTa("") {}

    // Constructor có tham số
    SanPhamViewModel1(string ten, double gia, string anh)
        : tenSanPham(ten), giaBan(gia), anhMoTa(anh) {}

    // Getter cho tên sản phẩm
    string getTenSanPham() const
    {
        return tenSanPham;
    }

    // Setter cho tên sản phẩm
    void setTenSanPham(string ten)
    {
        tenSanPham = ten;
    }

    // Getter cho giá bán
    double getGiaBan() const
    {
        return giaBan;
    }

    // Setter cho giá bán
    void setGiaBan(double gia)
    {
        giaBan = gia;
    }

    // Getter cho ảnh mô tả
    string getAnhMoTa() const
    {
        return anhMoTa;
    }

    // Setter cho ảnh mô tả
    void setAnhMoTa(string anh)
    {
        anhMoTa = anh;
    }

    // Hiển thị thông tin sản phẩm
    void hienThi() const
    {
        cout << "=== Thông tin sản phẩm ===" << endl;
        cout << "Tên sản phẩm: " << tenSanPham << endl;
        cout << "Giá bán: " << giaBan << " VND" << endl;
        cout << "Ảnh mô tả: " << anhMoTa << endl;
    }
};

// Hàm main để kiểm tra
int main()
{
    // Tạo sản phẩm với constructor có tham số
    SanPhamViewModel1 sanPham1("Laptop Dell XPS 13", 25000000, "laptop_dell_xps13.jpg");
    sanPham1.hienThi();

    cout << "\n";

    // Tạo sản phẩm với constructor mặc định và sử dụng setter
    SanPhamViewModel1 sanPham2;
    sanPham2.setTenSanPham("iPhone 15 Pro");
    sanPham2.setGiaBan(30000000);
    sanPham2.setAnhMoTa("iphone15pro.jpg");
    sanPham2.hienThi();

    return 0;
}
