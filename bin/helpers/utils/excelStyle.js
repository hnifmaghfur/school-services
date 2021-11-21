module.exports = {
  tTitleStyle: function () {
    return {
      font: {
        color: 'black',
        size: 15,
        bold: true
      },
      alignment: {
        wrapText: true,
        vertical: 'center'
      },
    };
  },

  tHeaderStyle: function () {
    return {
      font: {
        color: 'black',
        size: 12,
        bold: true
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        left: {
          style: 'medium',
          color: 'black'
        },
        right: {
          style: 'medium',
          color: 'black'
        },
        top: {
          style: 'medium',
          color: 'black'
        },
        bottom: {
          style: 'medium',
          color: 'black'
        },
      }
    };
  },

  tBodyLeftStyle: function () {
    return {
      font: {
        color: 'black',
        size: 11,
      },
      alignment: {
        wrapText: true,
        vertical: 'center',
      },
      border: {
        left: {
          style: 'thin',
          color: 'black'
        },
        right: {
          style: 'thin',
          color: 'black'
        },
        top: {
          style: 'thin',
          color: 'black'
        },
        bottom: {
          style: 'thin',
          color: 'black'
        },
      }
    };
  },

  tBodyStyle: function () {
    return {
      font: {
        color: 'black',
        size: 11,
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center',
      },
      border: {
        left: {
          style: 'thin',
          color: 'black'
        },
        right: {
          style: 'thin',
          color: 'black'
        },
        top: {
          style: 'thin',
          color: 'black'
        },
        bottom: {
          style: 'thin',
          color: 'black'
        },
      }
    };
  }

};
