async function printPdf() {
    const headerUnit = document.getElementById("headerUnit")?.value || "";
    const headerMFG = document.getElementById("headerMFG")?.value || "";
    const headerType = document.getElementById("headerType")?.value || "";

    // Spare-part
    const sparepartInputs = document.querySelectorAll('[name^="sparepart_"]');
    const sparepartRows = [];
    sparepartInputs.forEach((input) => {
        const index = input.name.split("_")[1];

        const item = {
            no: index,
            sparepart: input.value || "",
            condition: document.querySelector(`[name="condition_${index}"]`)?.value || "",
            quantity: document.querySelector(`[name="quantity_${index}"]`)?.value || "",
            unit_type: document.querySelector(`[name="unit_type_${index}"]`)?.value || "",
            remarks: document.querySelector(`[name="remarks_${index}"]`)?.value || "",
            priority: document.querySelector(`[name="priority_${index}"]`)?.value || "",
        };

        sparepartRows.push(item);
    });

    const sparepartTableRows = sparepartRows
        .map(
            (item) => `
      <tr>
        <td style="text-align: center; padding: 2mm; border: 1px solid #000;">${item.no}</td>
        <td style="padding: 2mm; border: 1px solid #000;">${item.sparepart}</td>
        <td style="padding: 2mm; border: 1px solid #000;">${item.condition}</td>
        <td style="padding: 2mm; border: 1px solid #000;">${item.quantity}</td>
        <td style="padding: 2mm; border: 1px solid #000;">${item.unit_type}</td>
        <td style="padding: 2mm; border: 1px solid #000;">${item.remarks}</td>
        <td style="padding: 2mm; border: 1px solid #000;">${item.priority}</td>
      </tr>
    `
        )
        .join("");

    const htmlContent = `
    <div style="
      width: 100%;
      height:296mm;
      margin: 0 auto;
      padding: 10mm;
      background: #fff;
      color: #000;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
      * { box-sizing: border-box; }
      table, tr, td, th { page-break-inside: avoid !important; }
      div, p { page-break-inside: avoid !important; }
    ">

      <!-- Header -->
      <div style="text-align: center; margin-bottom: 10mm;">
        <h2 style="margin: 0; font-size: 18px; text-decoration: underline;">
          Resume Pemeriksaan Safety Lift
        </h2>
      </div>

      <!-- Info Proyek -->
      <div style="margin-bottom: 8mm; font-size: 12px;">
        <p style="margin: 5px 0;">Berikut kami sampaikan rekomendasi spare part dan pekerjaan lainnya dari pemeriksaan safety lift di:</p>
        <p style="margin: 5px 0;">Nama Proyek:</p>
        <p style="margin: 5px 0;">Tanggal:</p>
      </div>

      <!-- Tabel Unit / Mfg / Tipe -->
      <table style="
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        margin-bottom: 6mm;
        border: 1px solid #000;
      ">
        <tr>
          <th colspan="2" style="text-align: left; padding: 2mm; border: 1px solid #000;">Unit: ${headerUnit}</th>
          <th colspan="3" style="text-align: left; padding: 2mm; border: 1px solid #000;">Mfg: ${headerMFG}</th>
          <th colspan="3" style="text-align: left; padding: 2mm; border: 1px solid #000;">Tipe: ${headerType}</th>
        
        </tr>
      </table>

      <!-- Tabel Spare Part -->
      <table style="
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        margin-bottom: 6mm;
        border: 1px solid #000;
      ">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="width: 5%; text-align: center; padding: 2mm; border: 1px solid #000;">No</th>
            <th style="width: 25%; text-align: center; padding: 2mm; border: 1px solid #000;">Item Spare Part</th>
            <th style="width: 15%; text-align: center; padding: 2mm; border: 1px solid #000;">Kondisi</th>
            <th style="width: 10%; text-align: center; padding: 2mm; border: 1px solid #000;">Jumlah</th>
            <th style="width: 10%; text-align: center; padding: 2mm; border: 1px solid #000;">Satuan</th>
            <th style="width: 20%; text-align: center; padding: 2mm; border: 1px solid #000;">Remarks</th>
            <th style="width: 15%; text-align: center; padding: 2mm; border: 1px solid #000;">Prioritas</th>
          </tr>
        </thead>
        <tbody>
          ${sparepartTableRows}
        </tbody>
      </table>

      <!-- Tabel Pekerjaan Lainnya -->
      <table style="
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        border: 1px solid #000;
      ">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="width: 5%; text-align: center; padding: 2mm; border: 1px solid #000;">No</th>
            <th colspan="2" style="width: 35%; text-align: center; padding: 2mm; border: 1px solid #000;">Pekerjaan Lainnya</th>
            <th style="width: 15%; text-align: center; padding: 2mm; border: 1px solid #000;">Kondisi</th>
            <th style="width: 15%; text-align: center; padding: 2mm; border: 1px solid #000;">Keterangan</th>
            <th style="width: 15%; text-align: center; padding: 2mm; border: 1px solid #000;">Remarks</th>
            <th style="width: 15%; text-align: center; padding: 2mm; border: 1px solid #000;">Prioritas</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center; padding: 2mm; border: 1px solid #000;">1.</td>
            <td colspan="2" style="padding: 2mm; border: 1px solid #000;"></td>
            <td style="padding: 2mm; border: 1px solid #000;"></td>
            <td style="padding: 2mm; border: 1px solid #000;"></td>
            <td style="padding: 2mm; border: 1px solid #000;"></td>
            <td style="padding: 2mm; border: 1px solid #000;"></td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 2mm; border: 1px solid #000;">2.</td>
            <td colspan="2" style="padding: 2mm; border: 1px solid #000;"></td>
            <td style="padding: 2mm; border: 1px solid #000;"></td>
            <td style="padding: 2mm; border: 1px solid #000;"></td>
            <td style="padding: 2mm; border: 1px solid #000;"></td>
            <td style="padding: 2mm; border: 1px solid #000;"></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

    const allElements = Array.from(document.body.children);
    allElements.forEach(el => {
        el.style.display = "none";
    });

    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    element.style.display = "block";
    document.body.appendChild(element);

    await html2pdf()
        .from(element)
        .set({
            margin: 0,
            filename: "resume-pemeriksaan-lift.pdf",
            html2canvas: {
                scale: 1,
                useCORS: true,
                logging: false,
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait",
            },
        })
        .save();

    element.remove();

    allElements.forEach(el => {
        el.style.display = "";
    });
}
