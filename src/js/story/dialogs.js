"use strict";
// ================= KỊCH BẢN TRỌN 13 CẢNH (viết lại bằng lời dễ hiểu, giữ nguyên chỉ số/dấu ấn/kết thúc của bản 2D) =================
var DLGS=[
{icon:"⏰", time:"05:00", phase:"Buổi sáng", title:"Chuông báo thức", obj:"🎯 Tới bên giường (Nhà ở), bắt đầu ngày mới",
 text:"Trời chưa sáng. 7 giờ sáng nay bạn có tiết dạy đầu tiên. Tối qua bạn soạn bài gần xong, chỉ còn một ví dụ khó chưa kiểm tra lại.\n\nĐồng hồ báo thức reo lần thứ hai.",
 choices:[
  {t:"Dậy ngay, mở bài giảng ra kiểm tra lại", fx:{en:-10,fi:6}, set:{prepared:true}, badge:"☀️ Chuẩn bị kỹ vì học trò",
   res:"Bạn ngồi vào bàn lúc cả nhà còn ngủ. Tới gần 6 giờ, bài giảng rõ ràng đâu vào đấy. Bạn ra khỏi nhà, đầu óc nhẹ hẳn."},
  {t:"Ngủ thêm 30 phút", fx:{en:10}, set:{unprepared:true},
   res:"30 phút ngủ thêm rất ngon. Nhưng ví dụ khó kia vẫn chưa ai kiểm tra. Bạn tự nhủ: lên lớp chắc sẽ ổn thôi."}
 ]},
{icon:"🚌", time:"06:45", phase:"Buổi sáng", title:"Trên đường tới trường", obj:"🎯 Ra điểm xe buýt ở Sân trường",
 text:"Ở bến xe buýt, một sinh viên khóa trước chạy lại chào bạn. Em vừa được nhận vào công ty em mơ ước, nhờ đúng đồ án tốt nghiệp mà bạn từng hướng dẫn.\n\nXe buýt của bạn sắp tới.",
 choices:[
  {t:"Dừng lại hỏi thăm em ấy, lỡ chuyến xe cũng được", fx:{en:-5,he:8}, set:{alumni:true}, badge:"🌱 Nhìn học trò lớn lên",
   res:"Em kể hết: làm ở bộ phận nào, tháng đầu được bao nhiêu, còn cảm ơn bạn rối rít. Bạn đi chuyến xe sau, tới trường muộn 10 phút, nhưng vui cả buổi sáng."},
  {t:"Chúc mừng nhanh rồi chạy cho kịp xe", fx:{en:2},
   res:"Bạn chúc mừng vài câu rồi chạy. Ngồi trên xe, bạn mới nhớ ra mình còn chưa hỏi em đang làm ở bộ phận nào."}
 ]},
{icon:"😴", time:"07:30", phase:"Buổi sáng", title:"Hàng ghế cuối", obj:"🎯 Vào Phòng học, tới hàng ghế cuối",
 text:"Tiết học đầu ngày. Ở hàng ghế cuối, một sinh viên gục xuống bàn ngủ. Chuyện này đã xảy ra mấy lần.\n\nCả lớp đang nhìn bạn, chờ xem bạn xử lý thế nào.",
 choices:[
  {t:"Đi xuống gọi em dậy, nhắc nhở nghiêm khắc trước cả lớp", fx:{en:-4,he:-6}, set:{strict:true},
   res:"Em ngồi dậy, mắt đỏ hoe, không nói câu nào. Cả tiết học im lặng hơn bình thường."},
  {t:"Dạy tiếp bình thường. Hết giờ gọi em lại hỏi riêng", fx:{en:-4,he:12}, set:{empathy:true}, badge:"👂 Lắng nghe trước khi trách",
   res:"Hỏi ra mới biết: em làm thêm ca đêm ở quán cà phê, 4 giờ sáng mới về nhà. Em nói: “Em xin lỗi, em không dám nghỉ việc, nhà em đang khó khăn.” May mà bạn đã không mắng em trước lớp."},
  {t:"Kể một chuyện vui, cho cả lớp đứng dậy vận động 1 phút", fx:{en:-6,he:5,fi:5},
   res:"Cả lớp cười ồ lên. Cậu sinh viên kia cũng tỉnh ngủ và cười theo. Tiết học lại vui như thường."}
 ]},
{icon:"❓", time:"09:00", phase:"Buổi sáng", title:"Câu hỏi khó", obj:"🎯 Lên gần bục giảng (Phòng học)",
 text:"Một sinh viên giơ tay hỏi một câu rất khó. Thú thật, bạn chưa chắc chắn về đáp án.\n\nCả lớp đang chờ bạn trả lời.",
 choices:[
  {t:"Nói thật là mình chưa chắc, hứa kiểm tra và trả lời buổi sau, ghi ngay vào sổ tay", fx:{he:6,fi:6}, set:{honest:true}, badge:"🤝 Trung thực với học trò",
   res:"Lớp im lặng một lúc, rồi vài em gật đầu. Tối nay bạn phải tra cứu thật. Nhưng bạn thấy nhẹ người: nói “thầy/cô chưa biết” không làm bạn mất mặt."},
  {t:"Trả lời vòng vo cho qua chuyện", fx:{fi:-12}, set:{bluff:true},
   res:"Câu trả lời nghe rất trôi chảy. Chỉ mình bạn biết là nó không có nội dung gì. Cảm giác đó theo bạn suốt đường về văn phòng."},
  {t:"Cho cả lớp cùng tìm đáp án trong 10 phút", fx:{en:-6,fi:10}, set:{creative:true}, badge:"💡 Biến khó thành hay",
   res:"Lớp học ồn lên hẳn. Cuối cùng, chính sinh viên đã tìm ra đáp án. Em hỏi câu đó là người cười tươi nhất."}
 ]},
{icon:"📩", time:"10:30", phase:"Buổi trưa", title:"Tin nhắn muốn bỏ học", obj:"🎯 Về Văn phòng, có tin nhắn giờ giải lao",
 text:"Giờ giải lao. Điện thoại rung. Một sinh viên học đang sa sút nhắn cho bạn:\n\n“Thầy/cô ơi, chắc em bỏ học thôi. Em học không vào, nhà em cũng đang khó khăn. Em xin lỗi.”",
 choices:[
  {t:"Gọi em lên văn phòng ngay, ngồi nghe em nói hết 30 phút", fx:{en:-10,he:15}, need:{en:20}, set:{saved:true}, badge:"🌟 Đưa tay đúng lúc",
   res:"Em khóc một lúc, rồi nói hết những chuyện giữ trong lòng cả tháng. Bạn chỉ hẹn một việc nhỏ: “Tuần này em cứ tới lớp. Phần còn lại mình tính tiếp.” Em gật đầu."},
  {t:"Nhắn lại một tin dài để động viên em", fx:{he:5}, set:{texted:true},
   res:"Tin nhắn của bạn rất chân thành. Nhưng máy của em đang có hơn 40 tin chưa đọc. Bạn không chắc em đã mở tin của mình."},
  {t:"Bạn đang ngập việc, hẹn em tuần sau nói chuyện", fx:{he:-10}, set:{postponed:true},
   res:"Bạn gõ “tuần sau nhé em” rồi quay lại làm việc. Với một người đang muốn bỏ cuộc hôm nay, “tuần sau” là rất lâu."}
 ]},
{icon:"🍚", time:"12:00", phase:"Buổi trưa", title:"Bữa trưa 15 phút", obj:"🎯 Xuống Căn-tin ăn trưa",
 text:function(S){ var base="Căn-tin đông người. Chiều nay bạn còn hai tiết dạy và một buổi họp. Bữa trưa của giảng viên thường chỉ có khoảng 15 phút.";
   return S.flags.empathy
   ? "Vừa ngồi xuống, em sinh viên ngủ gật ở tiết đầu ghé lại, đặt lên bàn bạn một ly cà phê: “Em cảm ơn thầy/cô, sáng nay thầy/cô đã không mắng em trước lớp.”\n\n"+base
   : base; },
 choices:[
  {t:"Ăn chậm rãi, gọi điện về nhà hỏi thăm một câu", fx:{en:10}, set:{family1:true}, badge:"🏠 Không quên người nhà",
   res:"Cuộc gọi chỉ 3 phút. Nhưng vào tiết chiều, bạn thấy người đỡ mỏi hơn hẳn."},
  {t:"Ăn vội, tranh thủ mở laptop chấm nốt mấy bài còn tồn", fx:{en:-6,fi:4},
   res:"Chấm thêm được 6 bài. Đổi lại, bạn không nhớ nổi trưa nay mình đã ăn món gì."}
 ]},
{icon:"🗂️", time:"13:30", phase:"Buổi chiều", title:"Buổi họp kéo dài", obj:"🎯 Họp khoa ở Văn phòng",
 text:"Họp khoa kéo dài hơn dự kiến 40 phút. Cuối buổi, bạn được giao thêm một phần việc chuẩn bị cho đợt kiểm định sắp tới. Việc không khó, nhưng rất tốn thời gian.",
 choices:[
  {t:"Nhận việc và ghi chú cẩn thận, khoa đang cần người", fx:{en:-10,fi:6}, set:{duty:true},
   res:"Bạn ghi hết vào sổ. Ra khỏi phòng họp, bạn tự hỏi: đây là lần thứ mấy trong tháng mình nói câu “để em lo”."},
  {t:"Xin san sẻ bớt việc vì bạn đang quá tải", fx:{en:6,fi:-6}, set:{declined:true},
   res:"Trưởng khoa gật đầu đồng ý. Bạn thấy nhẹ nhõm, và hơi áy náy. Cảm giác này quen thuộc với những người hay nhận việc."}
 ]},
{icon:"📄", time:"15:00", phase:"Buổi chiều", title:"Bài nộp trễ", obj:"🎯 Ra Hành lang, cửa Phòng học, có sinh viên chờ",
 text:"Một sinh viên mang bài tới nộp, trễ 3 ngày. Em nói mẹ em vừa nhập viện. Theo quy định, bài trễ 3 ngày bị 0 điểm phần này.\n\nEm đứng chờ, hai tay nắm chặt quai cặp.",
 choices:[
  {t:"Cho em thêm 2 ngày làm lại, kèm điều kiện nộp kế hoạch học lại phần đã hổng", fx:{he:12,fi:3}, set:{lenient:true}, badge:"🌿 Bao dung có nguyên tắc",
   res:"Em nói “Em cảm ơn thầy/cô!” và cúi đầu hai lần mới ra về. Quy định vẫn còn đó, nhưng em có thêm một cơ hội để sửa sai."},
  {t:"Làm đúng quy định: 0 điểm phần nộp trễ", fx:{he:-6,fi:2}, set:{strict2:true},
   res:"Em gật đầu, không xin thêm câu nào. Bạn đã làm đúng quy định. Chỉ là khi em quay đi, bạn nhìn theo lâu hơn bình thường."}
 ]},
{icon:"🌤️", time:"16:30", phase:"Buổi chiều", title:"Tiết cuối ngày", obj:"🎯 Vào Phòng học, tiết cuối ngày",
 text:function(S){ var base=S.flags.unprepared
   ? "Tiết cuối ngày. Ví dụ khó mà sáng nay bạn không kiểm tra đã gây rắc rối thật: một sinh viên hỏi dồn hai câu, bạn trả lời lúng túng. Cả lớp bắt đầu xì xào.\n\nGiờ giải lao giữa tiết, bạn ngồi một mình trong lớp, hơi mệt."
   : "Tiết cuối ngày diễn ra suôn sẻ. Ví dụ bạn kiểm tra từ 5 giờ sáng phát huy tác dụng: sinh viên gật gù đúng những chỗ quan trọng.\n\nTan tiết, còn vài em ở lại hỏi thêm.";
   if(S.flags.postponed) return "Chiều nay bạn nhìn xuống dãy bàn của em sinh viên đang sa sút. Em không tới lớp, chiếc ghế của em trống đúng chỗ em vẫn ngồi.\n\n"+base;
   if(S.flags.strict) return "Cậu sinh viên ngủ gật sáng nay cũng có mặt. Cả buổi em ngồi thẳng lưng, nhưng không ngẩng lên nhìn bảng lần nào.\n\n"+base;
   if(S.flags.strict2) return "Ngoài hành lang, em sinh viên nộp trễ ban trưa đi ngang. Thấy bạn, em khựng lại rồi quay đi hướng khác.\n\n"+base;
   return base; },
 choices:[
  {t:"Ở lại giải đáp cho các em đến khi hết thắc mắc", fx:{en:-10,he:10}, need:{en:15}, set:{staylate:true},
   res:"Khi bạn khóa cửa lớp, hành lang đã vắng. Một em chạy theo nói: “Nhờ thầy/cô mà em hiểu được chỗ em tắc cả tuần nay.”"},
  {t:"Thu dọn và về đúng giờ, tối còn một chồng bài phải chấm", fx:{en:6},
   res:"Bạn về nhà khi trời còn sáng. Rất hiếm khi có một buổi chiều như vậy. Bạn định dùng nó để nghỉ ngơi."}
 ]},
{icon:"🍽️", time:"19:00", phase:"Buổi tối", title:"Bữa cơm nhà", obj:"🎯 Về Nhà, bữa cơm đang chờ",
 text:"Mâm cơm nhà đã dọn xong. Người thân hỏi hôm nay bạn đi dạy thế nào. Trong túi xách của bạn là 28 bài kiểm tra chưa chấm. Sáng mai là hạn trả điểm.",
 choices:[
  {t:"Úp điện thoại xuống, ăn trọn bữa cơm với gia đình", fx:{en:14}, set:{family2:true}, badge:"🍚 Trọn vẹn một bữa cơm",
   res:"Bữa cơm kéo dài 40 phút, có tiếng cười nói. 28 bài kiểm tra vẫn đang chờ, nhưng bạn đã được nghỉ ngơi và vui vẻ trở lại."},
  {t:"Vừa ăn vừa chấm bài trên điện thoại", fx:{en:-6,he:-4}, set:{workhome:true},
   res:"Chấm thêm được 5 bài. Đổi lại, bạn bỏ lỡ câu chuyện vui nhất trên mâm cơm, mọi người đã kể xong khi bạn ngẩng đầu lên."}
 ]},
{icon:"💬", time:"21:00", phase:"Buổi tối", title:"Tin nhắn lúc 21 giờ", obj:"🎯 Tới bàn làm việc (Nhà), tin nhắn lúc 21 giờ",
 text:function(S){ var base=S.flags.saved
   ? "Điện thoại sáng lên. Là sinh viên sáng nay muốn bỏ học:\n\n“Thầy/cô ơi, em suy nghĩ rồi. Em sẽ tới lớp tiếp. Em cảm ơn vì sáng nay thầy/cô đã nghe em nói hết.”\n\nEm gửi kèm một đoạn bài làm lại. Bài còn vụng, nhưng là bài thật của em."
   : "Điện thoại sáng lên. Một sinh viên gửi ảnh chụp bài làm lúc 21 giờ, hỏi đúng chỗ khó nhất của bài, chỗ mà nhiều em đang mắc.\n\nĐã 21 giờ. Ngày mai bạn phải dậy lúc 5 giờ.";
   return S.flags.alumni
   ? "Trước đó một lúc, điện thoại bạn đã rung một lần. Là em sinh viên khóa trước: “Thầy/cô ơi, hôm nay em chính thức đi làm ngày đầu tiên. Em cảm ơn thầy/cô nhiều lắm.”\n\n"+base
   : base; },
 choices:[
  {t:"Trả lời ngay, chỉ dẫn rõ ràng, dù mất 20 phút", fx:{en:-10,he:10,fi:4}, need:{en:15}, set:{nightreply:true},
   res:"Bạn gõ một tin nhắn dài, kèm cách tự kiểm tra khi gặp lỗi giống vậy. Gửi xong đã 21:27. Nhưng tin nhắn “em hiểu rồi ạ!” đến ngay sau đó khiến bạn mỉm cười."},
  {t:"Đánh dấu lại, để sáng mai trả lời", fx:{en:5},
   res:"Bạn đặt điện thoại xuống và đi nghỉ. Đó là một giới hạn hợp lý, dù câu hỏi của em vẫn còn trong đầu bạn một lúc."}
 ]},
{icon:"📝", time:"23:00", phase:"Ban đêm", title:"Bài cuối cùng", obj:"🎯 Chấm nốt bài cuối cùng ở bàn làm việc",
 text:"23 giờ. Bạn đã chấm 27 bài. Bài thứ 28, bài cuối cùng, vừa đọc hai dòng bạn đã thấy quen: bài này chép nguyên một bài mẫu trên mạng, chép cả lỗi sai trong bài mẫu.\n\nNgày mai là hạn trả điểm.",
 choices:[
  {t:"Cho 0 điểm và hẹn gặp em ngày mai để nói chuyện riêng", fx:{fi:8,he:2}, set:{integrity:true}, badge:"⚖️ Giữ chuẩn đến phút cuối",
   res:"Bạn ghi vào sổ: “Gặp riêng, hỏi rõ lý do trước khi kết luận.” Bạn xử lý nghiêm, nhưng vẫn để em một cơ hội giải thích."},
  {t:"Bạn quá mệt. Cho qua lần này", fx:{fi:-14}, set:{letgo:true},
   res:"Bạn đặt bút xuống. Trong 27 bài làm tử tế hôm nay, đây là lần duy nhất bạn nhắm mắt cho qua. Chính điều đó làm bạn khó ngủ."},
  {t:"Trừ điểm nặng theo quy định, không cần gặp", fx:{he:-6,fi:3}, set:{harsh:true},
   res:"Xử lý xong trong 2 phút. Đúng quy định và nhanh gọn. Nhưng câu hỏi “vì sao em chép bài” sẽ không có ai hỏi nữa."}
 ]},
{icon:"🌙", time:"01:00", phase:"Ban đêm", title:"Đèn bàn tắt", obj:"🎯 Về giường, kết thúc một ngày dài",
 text:function(S){ var base="1 giờ sáng. Bài đã chấm xong. Bạn đã ghi việc cho ngày mai, ngày mai lại bắt đầu lúc 5 giờ.\n\nTrước khi ngủ, bạn còn có thể làm một việc nhỏ cho chính mình.";
   return S.flags.harsh
   ? "Trước khi tắt đèn, bạn chợt nhớ tới bài chép hồi 23 giờ. Em ấy sẽ nhận điểm trừ nặng, mà không ai hỏi em một câu vì sao.\n\n"+base
   : base; },
 choices:[
  {t:"Viết vài dòng nhật ký về ngày hôm nay", fx:{fi:8,he:4}, set:{journal:true},
   res:"Bạn viết: “Hôm nay mệt. Nhưng có một em đã không bỏ học.” Rồi gấp sổ lại. Một dòng ngắn như vậy cũng đủ giữ một người ở lại với nghề nhiều năm."},
  {t:"Tắt đèn, ngủ ngay, mai còn một ngày nữa", fx:{en:8},
   res:"Bạn ngủ thiếp đi rất nhanh. Ngày mai lại là một ngày làm giảng viên."}
 ]}
];
var COLLAPSE={icon:"🪫", time:"…", title:"Bạn gục xuống bàn",
 text:"Năng lượng của bạn đã cạn. Mắt bạn hoa lên, tay hơi run. Cơ thể đang bắt bạn phải dừng lại.\n\nBạn phải nằm nghỉ 20 phút và bỏ bớt một việc trong ngày. Giảng viên cũng là người bình thường, học trò cần một thầy cô còn khỏe vào ngày mai.",
 choices:[{t:"Nghỉ 20 phút. Ngày mai tính tiếp", fx:{en:32,fi:-8}, res:"Bạn chợp mắt một lúc và tỉnh dậy. Ngày chưa hết, nhưng bạn đã đỡ hơn và có thể đi tiếp."}]};

function computeEnding(){
  var f=S.flags;
  if(f.saved && f.honest && S.he>=60) return {id:"nho-den", icon:"💛", title:"Kết thúc: Người Thầy Được Nhớ Đến",
    text:"Nhiều năm sau, trong một buổi họp lớp, sinh viên năm nào suýt bỏ học, giờ đã đi làm, đứng lên nói: “Có một buổi sáng, em đã định bỏ học. Thầy/cô ngồi nghe em nói 30 phút. Nhờ vậy mà em học tiếp đến hôm nay.”\n\nBạn không nhớ hết những bài mình đã chấm. Nhưng học trò nhớ rất lâu những lần được thầy cô lắng nghe."};
  if(S.he<40 || (f.bluff && f.letgo)) return {id:"gia-nhu", icon:"🌧️", title:"Kết thúc: Giá Như Mình Chậm Lại",
    text:"Hôm nay không xảy ra chuyện gì lớn. Chỉ có mấy việc nhỏ bị bỏ qua: câu hỏi khó không ai trả lời, bài chép trên mạng được cho qua, và sinh viên muốn bỏ học vẫn chưa được gặp thầy cô để nói chuyện.\n\nNgười làm thầy ít khi gục vì thiếu kiến thức. Họ gục vì những lần quá bận để dừng lại một chút."};
  if(S.en<=25 && S.he>=55) return {id:"chay", icon:"🔥", title:"Kết thúc: Cháy Hết Mình",
    text:"Bạn về đến nhà, chân gần như không còn cảm giác. Nhưng trong điện thoại có ba tin nhắn cảm ơn, một lớp học đã hiểu bài, và một sinh viên đã không bỏ học.\n\nBạn ngủ thiếp đi trên ghế, rất mệt, và không hối hận về lựa chọn nào trong ngày hôm nay."};
  return {id:"binh-thuong", icon:"🌤️", title:"Kết thúc: Một Ngày Bình Thường",
    text:"Hôm nay không có chuyện gì đặc biệt. Chỉ là một ngày dạy học bình thường: bài được chấm, lớp được dạy, vài sinh viên được giúp đúng lúc.\n\nNhưng một đời đi dạy được làm nên từ hàng nghìn ngày bình thường như vậy. Nhiều thầy cô giỏi không ồn ào, họ chỉ có mặt đều đặn, ngày này qua ngày khác."};
}
function loadUnlocked(){ try{ return JSON.parse(localStorage.getItem('mot-ngay-lam-thay-endings')||"[]"); }catch(e){ return []; } }
function saveUnlocked(id){ var u=loadUnlocked(); if(u.indexOf(id)<0){ u.push(id); try{ localStorage.setItem('mot-ngay-lam-thay-endings', JSON.stringify(u)); }catch(e){} } return u; }

// ================= LUỒNG CHƠI =================
