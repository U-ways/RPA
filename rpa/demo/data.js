/* Data
  - Creating some collections with documents to mock a converged database

  TODO:
  - create a script to demo the data:
   - add the data on **demo init**
   - remove it when demo done

============================================================================= */
import Store from '../mvc/models/Store.js';
import User  from '../mvc/models/User.js';

/* Stores
============================================================================= */

const asda  = new Store({
  name: 'ASDA STORES LIMITED',
  address: {
    street: 'Asda House, South Bank, Great Wilson Street',
    county: 'Leeds',
    postcode: 'LS11 5AD',
    country: 'United Kingdom'
  }
});

const tesco = new Store({
  name: 'TESCO STORES LIMITED',
  address: {
    street: 'Tesco House, Shire Park, Kestrel Way',
    county: 'Welwyn Garden City',
    postcode: 'AL7 1GA',
    country: 'United Kingdom'
  }
});

const morrisons = new Store({
  name: 'WM MORRISON SUPERMARKETS PLC',
  address: {
    street: 'Hilmore House, Gain Lane, Bradford',
    county: 'West Yorkshire',
    postcode: 'BD3 7DL',
    country: 'United Kingdom'
  }
});

asda.products = [
  {
    name: 'Hovis White Bread',
    timeline: [
      // 16 July 2018
      { date: 1531699200, price: 1.05, sold: 1 },
      // 23 July 2018
      { date: 1532304000, price: 1.00, sold: 1 },
      // 30 July 2018
      { date: 1532908800, price: 1.00, sold: 1 },
      // 6 August 2018
      { date: 1533513600, price: 1.00, sold: 1 },
      // 13 August 2018
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Big & Fresh Eggs (Large)',
    timeline: [
      { date: 1531699200, price: 1.30, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Philadelphia Original Soft Cheese',
    timeline: [
      { date: 1531699200, price: 1.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Cheestrings Original',
    timeline: [
      { date: 1531699200, price: 2.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Tomatoes',
    timeline: [
      { date: 1531699200, price: 1.15, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Blueberries',
    timeline: [
      { date: 1531699200, price: 1.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Birds Eye Cod Fish Fingers',
    timeline: [
      { date: 1531699200, price: 2.50, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Gü Chocolate & Vanilla (Cheesecake)',
    timeline: [
      { date: 1531699200, price: 1.50, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Ben & Jerry\'s Cookie Dough (Ice Cream)',
    timeline: [
      { date: 1531699200, price: 2.50, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Franziskaner Weissbier (Wheat beer)',
    timeline: [
      { date: 1531699200, price: 1.78, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  }
];

tesco.products = [
  {
    name: 'Hovis White Bread',
    timeline: [
      // 16 July 2018
      { date: 1531699200, price: 1.05, sold: 1 },
      // 23 July 2018
      { date: 1532304000, price: 1.00, sold: 1 },
      // 30 July 2018
      { date: 1532908800, price: 1.00, sold: 1 },
      // 2 August 2018
      { date: 1533513600, price: 1.00, sold: 1 },
      // 9 August 2018
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Big & Fresh Eggs (Large)',
    timeline: [
      { date: 1531699200, price: 1.50, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Philadelphia Original Soft Cheese',
    timeline: [
      { date: 1531699200, price: 1.85, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Cheestrings Original',
    timeline: [
      { date: 1531699200, price: 3.50, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Tomatoes',
    timeline: [
      { date: 1531699200, price: 1.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Blueberries',
    timeline: [
      { date: 1531699200, price: 2.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Birds Eye Cod Fish Fingers',
    timeline: [
      { date: 1531699200, price: 2.50, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Gü Chocolate & Vanilla (Cheesecake)',
    timeline: [
      { date: 1531699200, price: 3.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Ben & Jerry\'s Cookie Dough (Ice Cream)',
    timeline: [
      { date: 1531699200, price: 3.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Franziskaner Weissbier (Wheat beer)',
    timeline: [
      { date: 1531699200, price: 1.80, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  }
];

morrisons.products = [
  {
    name: 'Hovis White Bread',
    timeline: [
      // 16 July 2018
      { date: 1531699200, price: 1.05, sold: 1 },
      // 23 July 2018
      { date: 1532304000, price: 1.00, sold: 1 },
      // 30 July 2018
      { date: 1532908800, price: 1.00, sold: 1 },
      // 2 August 2018
      { date: 1533513600, price: 1.00, sold: 1 },
      // 9 August 2018
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Big & Fresh Eggs (Large)',
    timeline: [
      { date: 1531699200, price: 1.50, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Philadelphia Original Soft Cheese',
    timeline: [
      { date: 1531699200, price: 1.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Cheestrings Original',
    timeline: [
      { date: 1531699200, price: 2.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Tomatoes',
    timeline: [
      { date: 1531699200, price: 1.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Blueberries',
    timeline: [
      { date: 1531699200, price: 2.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Birds Eye Cod Fish Fingers',
    timeline: [
      { date: 1531699200, price: 2.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Gü Chocolate & Vanilla (Cheesecake)',
    timeline: [
      { date: 1531699200, price: 2.00, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Ben & Jerry\'s Cookie Dough (Ice Cream)',
    timeline: [
      { date: 1531699200, price: 2.50, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  },
  {
    name: 'Franziskaner Weissbier (Wheat beer)',
    timeline: [
      { date: 1531699200, price: 1.87, sold: 1 },
      { date: 1532304000, price: 1.00, sold: 1 },
      { date: 1532908800, price: 1.00, sold: 1 },
      { date: 1533513600, price: 1.00, sold: 1 },
      { date: 1534118400, price: 1.00, sold: 1 }
    ]
  }
];

/* User
============================================================================= */

const uways = new User({
  username: 'u-ways',
  password: '1234abcd',
  email: 'u-ways@email.com'
});

const Joe = new User({
  username: 'Joe',
  password: '1234abcd',
  email: 'Joe@email.com'
});

uways.log = [
  {
    activity: 'Logout',
    date: 1531699200
  },
  {
    activity: 'Create',
    date: 1531699200,
    description: 'Store (WM MORRISON SUPERMARKETS PLC)'
  },
  {
    activity: 'Create',
    date: 1531699200,
    description: 'Store (TESCO STORES LIMITED)'
  },
  {
    activity: 'Create',
    date: 1531699200,
    description: 'Store (ASDA STORES LIMITED)'
  },
  {
    activity: 'Login',
    date: 1531699200
  }
];

Joe.log = [
  {
    activity: 'Logout',
    date: 1531799200
  },
  {
    activity: 'Update',
    date: 1531799200,
    description: 'Store (WM MORRISON SUPERMARKETS PLC)'
  },
  {
    activity: 'Update',
    date: 1531799200,
    description: 'Store (TESCO STORES LIMITED)'
  },
  {
    activity: 'Update',
    date: 1531799200,
    description: 'Store (ASDA STORES LIMITED)'
  },
  {
    activity: 'Login',
    date: 1531799200
  }
];
