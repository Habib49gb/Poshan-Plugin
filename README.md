# Poshan Calculator 🥗👶

Poshan Calculator is a lightweight, responsive, and user-friendly WordPress plugin designed to calculate growth and nutritional status indicators for children (aged 0 to 18 years) based on WHO guidelines. It evaluates key metrics such as **BMI**, **Stunting (Height-for-Age)**, **Underweight (Weight-for-Age)**, and **Wasting (Weight-for-Height)**.

With its sleek interface and interactive features, users can easily input child details, view instantly computed results with status badges, and download the report as a PDF.

---
## 🌐 Official Website

Try the live version of the **Poshan Calculator** here:

**Website:** https://babyposhancalculator.com

The Poshan Calculator helps parents, caregivers, and health workers assess child growth indicators such as BMI, stunting, underweight, and wasting using a simple and user-friendly interface.

## ✨ Features

- **Interactive Gender Selection**: Visual options for selecting Boy/Girl with high-quality icons.
- **Dynamic Age Calculation**: Automatically calculates age in months from the provided Date of Birth.
- **Synced Controls**: Slider controls for height (cm) and weight (kg) synchronized in real-time with number input fields.
- **Instant Nutrition Metrics**:
  - **BMI Calculation**
  - **Stunting Status** (Height-for-Age)
  - **Underweight Status** (Weight-for-Age)
  - **Wasting Status** (Weight-for-Height)
- **Interactive Results Screen**: Displays status badges (Normal, Wasting, Underweight, Severe, etc.) for quick comprehension.
- **Action Controls**:
  - **Back**: Returns to the form while preserving current inputs.
  - **Clear & New**: Clears all inputs and resets the calculator.
  - **Download PDF**: Generates and downloads a clean PDF report of the results locally using client-side libraries.

---

## 🛠️ Technology Stack & Libraries

- **WordPress Plugin Architecture**: Built using WordPress standards.
- **Frontend**: HTML5, Vanilla CSS3 (custom styles), and JavaScript.
- **Library Dependencies**:
  - **jQuery** (for DOM manipulation)
  - **html2pdf.js** (loaded via CDN for client-side PDF generation)

---

## 🚀 Installation & Setup

1. **Download the Plugin**: Clone or download this repository.
   ```bash
   git clone https://github.com/Habib49gb/Poshan-Plugin.git
   ```
2. **Compress**: Zip the folder `Poshan Plugin` containing all the assets and files.
3. **Upload to WordPress**:
   - Go to your WordPress Dashboard.
   - Navigate to **Plugins > Add New > Upload Plugin**.
   - Choose the zipped file and click **Install Now**.
   - **Activate** the plugin.

---

## 📖 Usage

To display the Poshan Calculator on any page, post, or widget area, simply insert the shortcode:

```text
[poshan_calculator]
```

### Shortcode Integration Example:
1. Open the page or post editor in WordPress.
2. Add a **Shortcode block** (if using Gutenberg block editor) or paste the shortcode in the Classic Editor.
3. Save or publish the page.

---

## 📂 Project Structure

```text
Poshan Plugin/
├── assets/
│   ├── css/
│   │   └── style.css       # Custom calculator styles
│   ├── js/
│   │   └── script.js      # Input synchronization, calculation logic & PDF export
│   └── images/
│       ├── boy.png        # Graphic for boy option
│       └── girl.png       # Graphic for girl option
├── poshan-calculator.php  # Main plugin file & shortcode definition
└── README.md              # Documentation
```

---
## 🔗 Resources

- Website: https://babyposhancalculator.com/
- Online Poshan Calculator: https://babyposhancalculator.com/
  
## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
