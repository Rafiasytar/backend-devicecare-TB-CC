const schema = {
  student: {
    name: "Muhammad Rafi Asytar",
    nim: "2311522030"
  },
  resource: {
    name: "maintenance-records",
    label: "Catatan Perawatan Perangkat",
    description:
      "Data pencatatan kegiatan perawatan perangkat elektronik."
  },
  fields: [
    {
      name: "device_name",
      label: "Nama Perangkat",
      type: "text",
      required: true,
      showInTable: true
    },
    {
      name: "device_type",
      label: "Jenis Perangkat",
      type: "text",
      required: true,
      showInTable: true
    },
    {
      name: "maintenance_date",
      label: "Tanggal Perawatan",
      type: "date",
      required: true,
      showInTable: true
    },
    {
      name: "technician_name",
      label: "Nama Teknisi",
      type: "text",
      required: true,
      showInTable: true
    },
    {
      name: "cost",
      label: "Biaya",
      type: "number",
      required: false,
      showInTable: true
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      showInTable: true,
      options: ["Dijadwalkan", "Dalam Proses", "Selesai"]
    },
    {
      name: "notes",
      label: "Catatan",
      type: "textarea",
      required: false,
      showInTable: true
    }
  ],
  endpoints: {
    list: "/maintenance-records",
    detail: "/maintenance-records/{id}",
    create: "/maintenance-records",
    update: "/maintenance-records/{id}",
    delete: "/maintenance-records/{id}"
  }
};

module.exports = schema;
