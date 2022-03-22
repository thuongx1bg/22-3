$(document).ready(function () {
  // load dữ liệu
  formMode = 0; // bằng 0 khi thêm mới. bằng 1 khi sửa
  employeeIdSelected = null;
  loadData();
  initEvents();
});
/**
 * thực hiện load dữ liệu trên UI
 * author:NVT
 */

function loadData() {
  try {
    $("table tbody").empty();
    //1. gọi api thực hiện lấy dữ liệu về client
    $.ajax({
      async: false,
      type: "GET", // httml methods (POST thêm mới , PUT sửa , DELETE)
      url: "http://amis.manhnv.net/api/v1/Employees", // địa chỉ của api
      data: "data", // đối số gửi lên cho tham sosos của Api (body request)
      //   dataType: "dataType", // kiểu dữ liệu của đối số/tham só
      //   contentType: "application/json",// kiểu dữ liêu trả về
      success: function (response) {
        //   nếu gọi đến api thành công
        console.log(response);

        let employees = response;
        // cách 1
        //1. duyệt các cột tiêu đè của bảng dữ liệu
        let ths = $("table thead th");
        var stt = 0;
        for (const emp of employees) {
          stt++;
          let trHTML = $(`<tr></tr>`);
          for (const th of ths) {
            let propName = th.getAttribute("propName");
            if (propName === "Stt") {
              value = stt;
            } else {
              value = emp[propName];
            }

            let format = th.getAttribute("format");
            switch (format) {
              case "Date":
                if (value) {
                  let DateOfBirth = new Date(value);
                  date = DateOfBirth.getDate();
                  month = DateOfBirth.getMonth() + 1;
                  year = DateOfBirth.getFullYear();
                  date = date > 10 ? date : `0${date}`;
                  month = month > 10 ? month : `0${month}`;
                  dateOfBirth = `${date}/${month}/${year}`;

                  var tdHTML = `<td class="text-align-center">${dateOfBirth} </td>`;
                } else {
                  var tdHTML = `<td class="text-align-center"> </td>`;
                }
                break;
              case "Salary":
                if (value) {
                  value = `${value.toLocaleString("vi-VN")} đ`;
                } else {
                  value = ``;
                }
                var tdHTML = `<td class="text-align-right">${value}</td>`;

                break;
              default:
                var tdHTML = `<td class="text-align-left">${value}</td>`;
                break;
            }

            $(trHTML).append(tdHTML);
          }
          // lưu trữ thông tin chi tiết của nhân viên vào tr
          $(trHTML).data("employeeId", emp.EmployeeId);
          $(trHTML).data("object", emp);
          $("table tbody").append(trHTML);
        }
        //2. đọc thông tin chi tiết về dữ liệu tương ứng với các cột
        //cách 2
        // var count = 0;
        // for (const empt of employees) {
        //   // lấy các thông tin cần thiết của nhân viên cần hiển hiện thị lên table
        //   let employeeCode = empt.EmployeeCode;
        //   let fullName = empt.EmployeeName;
        //   let salary = empt.Salary;
        //   let dateOfBirth = new Date(empt.DateOfBirth) ;
        //   count = count + 1;
        //   // định dạng lại ngày sinh --> ngày / tháng /năm:
        //   if(dateOfBirth){
        //       // lấy ngày
        //       date=dateOfBirth.getDate();
        //       // lấy tháng phải cộng thêm 1
        //       month=dateOfBirth.getMonth()
        //       // lấy năm
        //       year=dateOfBirth.getFullYear();
        //       // thêm ố 0 nếu ngày haowjc tháng nhỏ hơn 10
        //       if(date<10){ date=`0${date}` };
        //       if(month<10){ month=`0${month}`};
        //       dateOfBirth=`${date}/${month}/${year}`;
        //   }
        //   //định dang mức lương
        //   if(salary){

        //       salary=`${salary.toLocaleString('vi-VN')} đ`;
        //   }
        //   else{
        //       salary=``;
        //   }
        //   // built mã html tương ứng với dòng dữ liệu trong DOM
        //   let trHTML = `<tr>
        //   <td class="text-align-left">${count}</td>
        //   <td class="text-align-left">${fullName}</td>
        //   <td class="text-align-center">${dateOfBirth}</td>
        //   <td class="text-align-left">
        //    ${employeeCode}
        //   </td>
        //   <td class="text-align-right">${salary}</td>
        //   </tr>`;
        //   $("table tbody").append(trHTML);
        // }
      },
      error: function () {
        // nếu gọi đến api có lỗi
        console.log(error);
      },
    });
    //2. thực hiện build dữ liệu hiển thị lên table
    //2.1 định dạng dữ liệu
  } catch (error) {}
}
/**
 * Hàm thực hiện tạo các sự kiện cho elements trong trang
 * author NVT
 */
function initEvents() {
  // BUTTON THÊM MỚI
  $("#btnAdd").click(function (e) {
    // hiển thị chi tiết
    e.preventDefault();
    var inputs = $("[property]");
    for (const input of inputs) {
      $(input).css("color", "black");

      $(input).val(null);
    }

    $("#dlgDetail").show();

    // lấy mã nhân viên với về và bidding vào ô nhập mã nhân viên
    $.ajax({
      type: "GET",
      url: "http://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
      success: function (response) {
        $("#txtEmployeeCode").val(response);
        // forcus vào ô nhập liệu đầu tiên
        $("#txtEmployeeCode").focus();
      },
    });
  });
  // nhân button close thì ẩn dialog
  $(".m-dialog-header-close").click(function (e) {
    e.preventDefault();
    $("#dlgDetail").hide();
  });
  $(".m-btn-close").click(function (e) {
    e.preventDefault();
    $("#dlgDetail").hide();
  });

  // NHẤP CHUỘT VÀO DÒNG DỮ LIỆU THÌ HIỂN THỊ THÔNG TIN

  // $(".m-grid-table table tbody tr").click(function (e) {
  //   e.preventDefault();
  //   $("#dlgDetail").show();
  // });

  $(document).on("dblclick", ".m-grid-table table tbody tr", function () {
    // thực hiện lấy dữ liệu thoong tin chi tiết nhân viên
    formMode = 1;
    var employee = {};
    // c1: lấy dữ liệu được lưu trữ dưới clien
    // var employee = $(this).data("object");
    // c2 : lấy dữ liệu qua api
    var employeeId = $(this).data("employeeId");
    employeeIdSelected = employeeId;
    $.ajax({
      async: false,
      type: "GET",
      url: `http://amis.manhnv.net/api/v1/Employees/${employeeId}`,
      data: "data",

      success: function (response) {
        employee = response;
      },
    });
    bindingDetailData(employee);
    // biding dữ liệu lên các trường thông tin tương ứng

    // hiển thị form chi tiết
    $("#dlgDetail").show();
  });

  // Lưu dữ liệu
  $(".m-btn-save").click(btnSave);

  // xóa dữ liệu
  $("#btnDelete").click(btnDelete);
}
/**
 * Thực hieenjn xóa dữ liệu
 */
function btnDelete() {}
/**
 * thực hiện lưu dữ liệu
 * CreateBy : NVT(21/3/2022)
 */
function btnSave() {
  try {
    // b1 validate dữ liệu
    // 1. các thông tin bắt buộc phải nhập
    // 2. Các thông tin nhập phải đúng
    // 2.1 Email phải đúng định dạng
    // 2.2 Ngày sinh phải nhỏ hơn ngày hiện tại
    // 3 Độ dài dữ liệu không được quá 20 kí tự
    // build đối tượng
    employee = buildObject();
    // b2 thực hiện gọi api cất giữ liệu
    if (formMode == 0) {
      $.ajax({
        type: "POST",
        url: "http://amis.manhnv.net/api/v1/Employees",
        data: JSON.stringify(employee),
        // dataType: "application/json",
        contentType: "application/json",
        success: function (response) {
          alert("thêm mới thaanfh công");
          $("#dlgDetail").hide();

          loadData();
        },
        error: function (res) {
          var statusCode = res.status;
          var errorData = res.responseJSON;
          switch (statusCode) {
            case 400:
              alert(errorData.userMsg);
              break;
            default:
              break;
          }
        },
      });
    } else {
      $.ajax({
        type: "PUT",
        url: `http://amis.manhnv.net/api/v1/Employees/${employeeIdSelected}`,
        data: `json`,
        contentType: "application/json",

        success: function (response) {
          alert("sửa thành công ");
          $("#dlgDetail").hide();

          loadData();
        },
        error: function (res) {
          var statusCode = res.status;
          var errorData = res.responseJSON;
          switch (statusCode) {
            case 400:
              alert(errorData.userMsg);

              break;
            default:
              break;
          }
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * buil ra đối tượng cần lưu
 * @param {*} employee
 */

function buildObject() {
  try {
    var employee = {};
    var inputs = $("[property]");
    // duyệt từng cái input
    for (const input of inputs) {
      // lất thông tin property mà input sẽ binding dữ liệu:
      let propName = input.getAttribute("property");
      let propValue = input.value;
      employee[propName] = propValue;
    }
    return employee;
  } catch (error) {
    console.log(error);
  }
}

/**
 * thực hiện binding dữ liệu lên form
 * @param {*} employee
 */
function bindingDetailData(employee) {
  var inputs = $("[property]");
  // duyệt từng cái input
  for (const input of inputs) {
    $(input).css("color", "black");
    // lất thông tin property mà input sẽ binding dữ liệu:
    let propName = input.getAttribute("property");
    let propValue = employee[propName];
    // gán dữ liệu tương ứng
    // kiểm tra kiểu dữ liệu của input sẽ nhận vào
    let inputType = input.getAttribute("type");
    switch (inputType) {
      case "date":
        if (propValue) {
          let DateOfBirth = new Date(propValue);
          date = DateOfBirth.getDate();
          month = DateOfBirth.getMonth() + 1;
          year = DateOfBirth.getFullYear();
          date = date > 10 ? date : `0${date}`;
          month = month > 10 ? month : `0${month}`;
          propValue = `${year}-${month}-${date}`;
          $(input).val(propValue);
        }
        break;
      default:
        $(input).val(propValue);
        break;
    }
  }
  // $("#txtEmployeeCode").val(employee.EmployeeCode);
}

function trDblClick() {
  var employee = $(this).data("object");
}
// khai báo đối tượng trong js
