import Icon from './Icon';

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden border-t-4 border-orange-600">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-600 border-2 border-orange-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h3 className="text-2xl font-bold text-orange-400">
                Restub
              </h3>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              The ultimate platform for cataloging and sharing your sports game experiences. 
              Turn your stadium memories into lasting digital collections.
            </p>
          </div>
          
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Restub. All rights reserved. Made for sports fans everywhere.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Icon name="rocket" className="text-orange-400" size="xs" />
                <span>Beta v1.0</span>
              </span>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Icon name="pulse" className="text-green-500 animate-pulse" size="xs" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;