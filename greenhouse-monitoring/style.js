import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: "#000",
    marginLeft: 8,
  },

  // Info Row
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  infoBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    padding: 10,
    marginRight: 8,
  },
  infoText: {
    color: "#555",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
    display: "inline-block",
  },
  statusText: {
    color: "#000",
  },
  reloadBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    padding: 10,
    marginRight: 8,
  },
  reloadText: {
    marginLeft: 4,
    fontSize: 12,
  },

  // Zona
  zoneBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  zoneTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  zoneSubtitle: {
    color: "#777",
    marginTop: 4,
  },
  sectionContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  sectionContainerAktuator: {
    alignItems: "center",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
  },
  arrowButton: {
  paddingHorizontal: 5,
},
  tempCard: {
    width: width * 0.75,
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  deviceCard: {
    width: "100%",
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  deviceValue: {
    fontSize: 25,
    fontWeight: "700",
    marginVertical: 10,
  },
  deviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceValueRow: {
  flexDirection: "row",
  alignItems: "flex-end",
  marginTop: 5,
  },
  deviceValue: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#222",
  },
  deviceUnit: {
    fontSize: 18,
    color: "#666",
    marginLeft: 4,
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: "#d4f8d4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#008000",
    fontWeight: "600",
  },
  targetText: {
    color: "#666",
    fontSize: 13,
  },
  chartCard: {
    marginTop: -5,
    borderRadius: 16,
    padding: 15,
  },
  aktuatorCard: {
  paddingVertical: 15,
  paddingHorizontal: 10,
},

aktuatorRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

aktuatorLeft: {
  flexDirection: "row",
  alignItems: "flex",
  marginTop: -10,
},

aktuatorIconBox: {
  width: 40,
  height: 40,
  borderRadius: 10,
  backgroundColor: "#f0f0f0",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 5,
},

aktuatorTitle: {
  fontWeight: "bold",
  fontSize: 16,
  color: "#000",
  marginTop: -5,
  marginBottom: 10,
},

aktuatorSub: {
  color: "#666",
  fontSize: 12,
  marginVertical: 3
},
aktuatorSubSub: {
  color: "#666",
  fontSize: 12,
  marginTop: 12
},
aktuatorRight: {
  alignItems: "flex-end",
  marginTop: -15
},

aktuatorAutoText: {
  color: "#666",
  fontSize: 12,
  marginHorizontal: 8,
  marginBottom: -10
},

  cfContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },

  cfHeader: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },

  cfRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  cfLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  cfBox: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  cfSubTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  cfModeRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  cfModeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
  },

  cfModeActive: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },

  cfModeText: {
    color: "#555",
    fontWeight: "600",
  },

  cfModeTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  cfBoxInner: {
    marginTop: 20,
  },

  cfInputRow: {
    marginBottom: 15,
  },

  cfInputLabel: {
    fontSize: 14,
    marginBottom: 5,
  },

  cfInput: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  cfReadonlyBox: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 6,
  },

  cfReadonlyText: {
    color: "#555",
  },

  cfApplyButton: {
    marginTop: 10,
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cfApplyText: {
    color: "#fff",
    fontWeight: "700",
  },


});
